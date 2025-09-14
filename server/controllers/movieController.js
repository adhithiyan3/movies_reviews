const Movie = require('../models/Movie');
const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Movie.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Movie.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const movies = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    status: 'success',
    count: movies.length,
    total,
    pagination,
    data: {
      movies,
    },
  });
});

exports.getMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id).populate({
    path: 'reviews', // Assuming virtual 'reviews' in Movie model
    select: 'reviewText rating user createdAt'
  });

  if (!movie) {
    return next(new AppError(`No movie found with id ${req.params.id}`, 404));
  }

  // Manually fetch reviews as 'reviews' is not a direct field
  const reviews = await Review.find({ movie: req.params.id }).populate({
    path: 'user',
    select: 'username profilePicture'
  });

  res.status(200).json({
    status: 'success',
    data: {
      movie: {
        ...movie.toObject(),
        reviews
      },
    },
  });
});

exports.createMovie = catchAsync(async (req, res, next) => {
  // Ensure the user is an admin (handled by authMiddleware.js)
  const newMovie = await Movie.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      movie: newMovie,
    },
  });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  // Admin only
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) {
    return next(new AppError(`No movie found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  // Admin only
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) {
    return next(new AppError(`No movie found with id ${req.params.id}`, 404));
  }

  // Also delete all associated reviews
  await Review.deleteMany({ movie: req.params.id });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});