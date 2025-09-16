const express = require('express');
const router = express.Router();
const { z } = require('zod');
const User = require('../models/User');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

// ========================
// GET /users/:id - profile + review history
// ========================
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  const reviews = await Review.find({ userId: user._id })
    .populate('movieId', 'title posterUrl');
    console.log(user);

  res.json({ user, reviews });
});

// ========================
// PUT /users/:id - update profile
// ========================
const updateSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  profilePicture: z.string().url("Invalid URL").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional()
});

router.put('/:id', auth, async (req, res) => {
  if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const validation = updateSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      message: validation.error.errors[0].message
    });
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  Object.assign(user, validation.data);
  if (validation.data.password) {
    user.password = validation.data.password; 
  }

  await user.save();
  res.json({
    message: 'Profile updated',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture
    }
  });
});

// ========================
// GET /users/:id/watchlist
// ========================
router.get('/:id/watchlist', auth, async (req, res) => {
  if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const items = await Watchlist.find({ userId: req.params.id })
    .populate('movieId', 'title posterUrl releaseYear');

  res.json(items.map(i => ({
    id: i._id,
    movie: i.movieId,
    dateAdded: i.dateAdded
  })));
});

// ========================
// POST /users/:id/watchlist - add movie
// ========================
const watchlistSchema = z.object({
  movieId: z.string()
});

router.post('/:id/watchlist', auth, async (req, res) => {
  if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const validation = watchlistSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      message: validation.error.errors[0].message
    });
  }

  const { movieId } = validation.data;

  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });

  try {
    const wl = new Watchlist({ userId: req.params.id, movieId });
    await wl.save();
    res.status(201).json({ message: 'Added to watchlist' });
  } catch (err) {
    // duplicate key -> already in watchlist
    res.status(400).json({ message: 'Movie already in watchlist' });
  }
});

// ========================
// DELETE /users/:id/watchlist/:movieId
// ========================
router.delete('/:id/watchlist/:movieId', auth, async (req, res) => {
  if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const result = await Watchlist.findOneAndDelete({
    userId: req.params.id,
    movieId: req.params.movieId
  });

  if (!result) return res.status(404).json({ message: 'Not in watchlist' });

  res.json({ message: 'Removed from watchlist' });
});

module.exports = router;
