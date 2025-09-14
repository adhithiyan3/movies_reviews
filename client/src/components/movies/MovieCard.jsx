import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MovieCard({ movie, isInWatchlist, onToggleWatchlist }) {
  const { user } = useAuth();

  const handleButtonClick = (event) => {
    // Stop the click from propagating to the parent Link component
    event.preventDefault();
    event.stopPropagation();
    onToggleWatchlist(movie._id);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col justify-between transform hover:-translate-y-2 transition duration-300 group">
      <Link to={`/movies/${movie._id}`} className="block flex-grow">
        <div className="aspect-[3/4] w-full bg-gray-700 overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition">{movie.title}</h3>
          <p className="text-xs text-gray-400 mt-1">{movie.releaseYear}</p>
        </div>
      </Link>
      {user && (
        <button
          onClick={handleButtonClick}
          className={`w-full text-center py-2.5 text-sm font-semibold transition ${isInWatchlist ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </button>
      )}
    </div>
  );
}
