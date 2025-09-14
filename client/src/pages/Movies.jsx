import React, { useEffect, useState } from "react";
import axios from "../api";
import MovieCard from "../components/movies/MovieCard";
import Loader from "../components/ui/Loader";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/movies?q=${query}&genre=${genre}&year=${year}&sort=${sort}`
        );
        setMovies(res.data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [query, genre, year, sort]);

  return (
    <div className="p-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search movies..."
        className="w-full p-2 mb-4 border rounded"
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          className="border p-2 rounded"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Drama">Drama</option>
          <option value="Comedy">Comedy</option>
        </select>

        <input
          type="number"
          placeholder="Year"
          className="border p-2 rounded"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort by Title</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;
