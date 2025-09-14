const express = require('express');
const router = express.Router();
const { z } = require('zod');
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

// ========================
// GET /movies/:id/reviews - retrieve reviews for a movie (pagination)
// ========================
router.get('/:id/reviews', async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const movieId = req.params.id;

  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });

  const total = await Review.countDocuments({ movieId });
  const reviews = await Review.find({ movieId })
    .populate('userId', 'username profilePicture')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ page, limit, total, results: reviews });
});

// ========================
// POST /movies/:id/reviews - create or update review
// ========================
const reviewSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  text: z.string().optional()
});
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const movieId = req.params.id;

    const validation = reviewSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.errors[0].message
      });
    }

    const { rating, text } = validation.data;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    // Upsert: allow user to create or update their review
    let review = await Review.findOne({ userId: req.user._id, movieId });
    if (review) {
      review.rating = rating;
      review.text = text;
      await review.save();
    } else {
      review = new Review({ userId: req.user._id, movieId, rating, text });
      await review.save();
    }

    // Recalculate average rating and count
    const agg = await Review.aggregate([
      { $match: { movieId: movie._id } },
      { $group: { _id: '$movieId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (agg.length) {
      movie.averageRating = Number(agg[0].avg.toFixed(2));
      movie.reviewCount = agg[0].count;
    } else {
      movie.averageRating = 0;
      movie.reviewCount = 0;
    }
    await movie.save();

    res.status(201).json({
      message: 'Review submitted',
      averageRating: movie.averageRating,
      reviewCount: movie.reviewCount,
      review // ✅ send review object back
    });
  } catch (err) {
    console.error("Error submitting review:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});




module.exports = router;
