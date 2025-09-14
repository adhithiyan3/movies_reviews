import React from 'react';
import { Link } from 'react-router-dom';


export default function MovieCard({ movie }) {
return (
<article className="bg-white rounded-lg shadow-sm overflow-hidden">
<Link to={`/movies/${movie._id}`} className="block">
<div className="aspect-[3/4] w-full bg-gray-200">
{movie.posterUrl ? (
<img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
) : (
<div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
)}
</div>
<div className="p-3">
<h3 className="text-sm font-semibold truncate">{movie.title}</h3>
<p className="text-xs text-gray-500 mt-1">{movie.releaseYear} • {movie.genre?.join(', ')}</p>
<div className="mt-2 flex items-center justify-between">
<span className="text-sm font-medium">{movie.averageRating ?? '-'} ⭐</span>
<span className="text-xs text-gray-400">{movie.reviewCount ?? 0} reviews</span>
</div>
</div>
</Link>
</article>
);
}