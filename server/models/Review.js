const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String }
  },
  { timestamps: true } // <-- adds createdAt + updatedAt automatically
);

reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true }); // one review per user per movie

module.exports = mongoose.model('Review', reviewSchema);
