import React from 'react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  return (
    <article className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition shadow-gray-900 border border-gray-700 hover:border-gray-500 group">
      <Link to={`/movies/${movie._id}`} className="block">
        <div className="aspect-[3/4] w-full bg-gray-700 overflow-hidden relative">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-30" />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold text-white truncate">{movie.title}</h3>
          <p className="text-xs text-gray-400">{movie.releaseYear} • {movie.genre?.join(', ')}</p>
          <div className="flex items-center justify-between text-gray-300">
            <span className="font-medium">{movie.averageRating != null ? movie.averageRating.toFixed(1) : '-' } ⭐</span>
            <span className="text-xs">{movie.reviewCount ?? 0} reviews</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
