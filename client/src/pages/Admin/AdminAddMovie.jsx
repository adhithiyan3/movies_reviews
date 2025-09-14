import React, { useState } from "react";
import axios from "../../api";
import Button from "../../components/ui/Button";
import GenreSelector from "../../components/movies/GenreSelector";
import { useNavigate } from "react-router-dom";

const AdminAddMovie = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    title: "",
    posterUrl: "",
    releaseYear: "",
    synopsis: "",
    genre: [],
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...movie,
        releaseYear: parseInt(movie.releaseYear)
      };
      const res = await axios.post("/movies", payload);
      alert("Movie added successfully!");
      navigate(`/movies/${res.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add movie");
    }
  };

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (selectedGenres) => {
    setMovie({ ...movie, genre: selectedGenres });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-900 text-white">
      <div className="p-8 max-w-lg w-full bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Add New Movie</h1>
        <form onSubmit={handleAdd} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />
        <input
          type="text"
          name="posterUrl"
          placeholder="Poster URL"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />
        <input
          type="number"
          name="releaseYear"
          placeholder="Release Year"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />
        <textarea
          name="synopsis"
          placeholder="Synopsis"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          onChange={handleChange}
        />
        <div>
          <label className="block text-sm text-gray-400 mb-1">Genres (select multiple)</label>
          <GenreSelector selectedGenres={movie.genre} onChange={handleGenreChange} />
        </div>
        <Button type="submit" className="w-full !mt-6 bg-blue-600 hover:bg-blue-700">Add Movie</Button>
      </form>
      </div>
    </div>
  );
};

export default AdminAddMovie;
