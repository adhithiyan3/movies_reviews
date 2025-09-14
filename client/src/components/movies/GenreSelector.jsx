import React from 'react';

export const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"
];

const GenreSelector = ({ selectedGenres, onChange }) => {
  const handleGenreChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    onChange(selectedOptions);
  };

  return (
    <select
      multiple
      value={selectedGenres}
      onChange={handleGenreChange}
      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
    >
      {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
    </select>
  );
};

export default GenreSelector;