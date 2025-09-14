import React, { useEffect, useState } from "react";
import axios from "../api";
import MovieCard from "../components/movies/MovieCard";
import Loader from "../components/ui/Loader";
import { useAuth } from "../context/AuthContext";
import { genres as allGenres } from "../components/movies/GenreSelector";

const Movies = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("");
  const [watchlist, setWatchlist] = useState(new Set());

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/movies?q=${query}&genre=${genre}&year=${year}&sort=${sort}`
        );
        setMovies(res.data.results || []);

        if (user) {
          const wlRes = await axios.get(`/users/${user.id}/watchlist`);
          const watchlistIds = new Set(wlRes.data.map(item => item.movie._id));
          setWatchlist(watchlistIds);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [query, genre, year, sort, user]);

  const handleToggleWatchlist = async (movieId) => {
    if (!user) return; // Or redirect to login
    try {
      if (watchlist.has(movieId)) {
        await axios.delete(`/users/${user.id}/watchlist/${movieId}`);
        setWatchlist(prev => { const next = new Set(prev); next.delete(movieId); return next; });
      } else {
        await axios.post(`/users/${user.id}/watchlist`, { movieId });
        setWatchlist(prev => new Set(prev).add(movieId));
      }
    } catch (err) { console.error("Failed to update watchlist", err); }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">Browse Movies</h1>

        {/* Search + Filters */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4 shadow-lg">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Genre</label>
              <select
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="">All Genres</option>
                {allGenres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Year</label>
              <input
                type="number"
                placeholder="e.g. 2023"
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sort By</label>
              <select
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Title (A-Z)</option>
                <option value="rating">Rating (High → Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Movie Results */}
        {loading ? (
          <Loader />
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 pt-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                isInWatchlist={watchlist.has(movie._id)}
                onToggleWatchlist={handleToggleWatchlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 pt-10">
            No movies found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
