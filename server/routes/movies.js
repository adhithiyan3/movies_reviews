const express = require('express');
const router = express.Router();
const { z } = require('zod');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// ========================
// GET /movies - list with pagination and filtering
// ========================
router.get('/', async (req, res) => {
  let { page = 1, limit = 10, genre, year, director, q, sort } = req.query;
  page = parseInt(page);
  limit = Math.min(parseInt(limit || 10), 100);

  const filter = {};
  if (genre) filter.genre = { $in: Array.isArray(genre) ? genre : genre.split(',') };
  if (year) filter.releaseYear = parseInt(year);
  if (director) filter.director = new RegExp(director, 'i');
  if (q) filter.title = new RegExp(q, 'i');

  const total = await Movie.countDocuments(filter);
  const movies = await Movie.find(filter)
    .sort(sort === 'rating' ? { averageRating: -1 } : { title: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ page, limit, total, results: movies });
});

// ========================
// GET /movies/:id - retrieve a movie with reviews (paginated)
// ========================
router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });

  // reviews populated separately
  res.json(movie);
});

// ========================
// POST /movies - admin only
// ========================
const movieSchema = z.object({
  title: z.string(),
  genre: z.array(z.string()).default([]),
  releaseYear: z.number().optional(),
  director: z.string().optional(),
  cast: z.array(z.string()).optional(),
  synopsis: z.string().optional(),
  posterUrl: z.string().url().optional()
});

router.post('/', auth, admin, async (req, res) => {
  const validation = movieSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: validation.error.errors[0].message
    });
  }

  const movie = new Movie(validation.data);
  await movie.save();
  res.status(201).json(movie);
});

router.put('/:id', auth, admin, async (req, res) => {
  const validation = movieSchema.partial().safeParse(req.body); 
  if (!validation.success) {
    return res.status(400).json({
      message: validation.error.errors[0].message
    });
  }

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { $set: validation.data },
    { new: true } 
  );

  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json(movie);
});


router.delete('/:id', auth, admin, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });

  res.json({ message: 'Movie deleted successfully' });
});


module.exports = router;
