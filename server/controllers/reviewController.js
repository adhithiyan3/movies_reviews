const Review = require('../models/Review');
const Movie = require('../models/Movie');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getReviewsForMovie = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ movie: req.params.movieId }).populate({
    path: 'user',
    select: 'username profilePicture'
  });

  if (!reviews) {
    return next(new AppError('No reviews found for this movie', 404));
  }

  res.status(200).json({
    status: 'success',
    count: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.addReview = catchAsync(async (req, res, next) => {
  req.body.movie = req.params.movieId;
  req.body.user = req.user.id; // From protect middleware

  const movie = await Movie.findById(req.params.movieId);
  if (!movie) {
    return next(new AppError(`No movie found with id ${req.params.movieId}`, 404));
  }

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError(`No review found with id ${req.params.id}`, 404));
  }

  // Make sure user is review owner
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError(`User ${req.user.id} is not authorized to update this review`, 401)
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError(`No review found with id ${req.params.id}`, 404));
  }

  // Make sure user is review owner or admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError(`User ${req.user.id} is not authorized to delete this review`, 401)
    );
  }

  await review.remove(); // Triggers pre/post hooks for average rating

  res.status(204).json({
    status: 'success',
    data: null,
  });
});