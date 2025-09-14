import React from 'react';


export default function WatchlistCard({ movie, onRemove }) {
return (
<div className="flex items-center gap-3 bg-white rounded p-2 shadow-sm">
<div className="w-16 h-20 bg-gray-200 flex-shrink-0">
{movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />}
</div>
<div className="flex-1">
<div className="font-semibold">{movie.title}</div>
<div className="text-xs text-gray-500">{movie.releaseYear}</div>
</div>
<button onClick={onRemove} className="text-sm text-red-500">Remove</button>
</div>
);
}