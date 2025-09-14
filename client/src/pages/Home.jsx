import React, { useEffect, useState } from "react";
import axios from "../api";
import MovieCard from "../components/movies/MovieCard";
import PageNavigation from "../components/layout/PageNavigation";
import Loader from "../components/ui/Loader";
import { Link } from "react-router-dom";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingRes, latestRes] = await Promise.all([
          axios.get("/movies?limit=7&sort=rating"),
          axios.get("/movies?limit=6&sort=createdAt"),
        ]);
        setTrendingMovies(trendingRes.data.results);
        setLatestMovies(latestRes.data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <Loader />;

  const heroMovie = trendingMovies.length > 0 ? trendingMovies[0] : null;
  const topMovies = trendingMovies.length > 1 ? trendingMovies.slice(1) : [];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-12">
        <PageNavigation paths={[{ name: "Home", to: "/" }]} className="text-gray-300" />

        {heroMovie && (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 group">
            <img
              src={heroMovie.posterUrl}
              alt={heroMovie.title}
              className="w-full h-[28rem] object-cover transform group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <h1 className="text-5xl font-extrabold mb-3 drop-shadow-lg">{heroMovie.title}</h1>
              <p className="max-w-2xl text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                {heroMovie.synopsis}
              </p>
              <Link
                to={`/movies/${heroMovie._id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition duration-300"
              >
                View Details
              </Link>
            </div>
          </div>
        )}

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Top Rated Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
            {topMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Recently Added</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
            {latestMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
