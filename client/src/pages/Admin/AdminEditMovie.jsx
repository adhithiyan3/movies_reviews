import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api";
import Button from "../../components/ui/Button";
import GenreSelector from "../../components/movies/GenreSelector";
import Loader from "../../components/ui/Loader";

const AdminEditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error("Failed to fetch movie", err);
        alert("Could not load movie data.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...movie, releaseYear: parseInt(movie.releaseYear) };
      await axios.put(`/movies/${id}`, payload);
      alert("Movie updated successfully!");
      navigate(`/movies/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update movie");
    }
  };

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (selectedGenres) => {
    setMovie({ ...movie, genre: selectedGenres });
  };

  if (loading) return <Loader />;
  if (!movie) return <div className="text-center text-white">Movie not found.</div>;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-900 text-white">
      <div className="p-8 max-w-lg w-full bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Edit Movie</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input type="text" name="title" placeholder="Title" value={movie.title}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md" onChange={handleChange} />
          <input type="text" name="posterUrl" placeholder="Poster URL" value={movie.posterUrl}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md" onChange={handleChange} />
          <input type="number" name="releaseYear" placeholder="Release Year" value={movie.releaseYear}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md" onChange={handleChange} />
          <textarea name="synopsis" placeholder="Synopsis" value={movie.synopsis}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md h-24" onChange={handleChange} />
          <div>
            <label className="block text-sm text-gray-400 mb-1">Genres (select multiple)</label>
            <GenreSelector selectedGenres={movie.genre || []} onChange={handleGenreChange} />
          </div>
          <div className="flex gap-4 justify-end pt-4">
            <Button type="button" onClick={() => navigate(`/movies/${id}`)} className="bg-gray-600 hover:bg-gray-500 text-white">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditMovie;