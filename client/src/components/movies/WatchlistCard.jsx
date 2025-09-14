import React from 'react';
import { Link } from 'react-router-dom';


export default function WatchlistCard({ movie, onRemove }) {
return (
<div className="flex items-center gap-4 bg-gray-900/50 rounded-lg p-3 shadow-sm transition hover:bg-gray-900/80">
    <Link to={`/movies/${movie._id}`} className="w-16 h-24 bg-gray-700 flex-shrink-0 rounded-md overflow-hidden">
        {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />}
    </Link>
    <div className="flex-1">
        <Link to={`/movies/${movie._id}`} className="font-semibold text-white hover:text-blue-400">{movie.title}</Link>
        <div className="text-xs text-gray-400 mt-1">{movie.releaseYear}</div>
        <button onClick={onRemove} className="text-xs text-red-500 hover:text-red-400 mt-2">Remove</button>
    </div>
</div>
);
}