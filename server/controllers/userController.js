const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new AppError(`No user found with id ${req.params.id}`, 404));
  }

  // Fetch user's review history
  const reviews = await Review.find({ user: req.params.id }).populate({
    path: 'movie',
    select: 'title posterURL'
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        ...user.toObject(),
        reviews
      },
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  // Only allow updating specific fields
  const allowedFields = ['username', 'email', 'profilePicture'];

  const filteredBody = {};
  Object.keys(req.body).forEach(el => {
    if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
  });

  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    return next(new AppError(`No user found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getWatchlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate({
    path: 'watchlist',
    select: 'title posterURL releaseYear'
  });

  if (!user) {
    return next(new AppError(`No user found with id ${req.params.id}`, 404));
  }

  // Make sure user is authorized to view this watchlist (or admin)
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to view this watchlist', 403));
  }

  res.status(200).json({
    status: 'success',
    count: user.watchlist.length,
    data: {
      watchlist: user.watchlist,
    },
  });
});

exports.addMovieToWatchlist = catchAsync(async (req, res, next) => {
  const { movieId } = req.body; // Expect movieId in body

  // Check if movie exists
  const movie = await Movie.findById(movieId);
  if (!movie) {
    return next(new AppError('Movie not found', 404));
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError(`No user found with id ${req.params.id}`, 404));
  }

  // Check if movie already in watchlist
  if (user.watchlist.includes(movieId)) {
    return next(new AppError('Movie already in watchlist', 400));
  }

  user.watchlist.push(movieId);
  await user.save({ validateBeforeSave: false }); // Skip password hashing etc.

  res.status(200).json({
    status: 'success',
    data: {
      watchlist: user.watchlist,
    },
  });
});

exports.removeMovieFromWatchlist = catchAsync(async (req, res, next) => {
  const { movieId } = req.params;

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError(`No user found with id ${req.params.id}`, 404));
  }

  const initialWatchlistLength = user.watchlist.length;
  user.watchlist = user.watchlist.filter(id => id.toString() !== movieId);

  if (user.watchlist.length === initialWatchlistLength) {
    return next(new AppError('Movie not found in watchlist', 404));
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      watchlist: user.watchlist,
    },
  });
});