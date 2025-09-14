import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../api";
import Loader from "../components/ui/Loader";
import ReviewCard from "../components/reviews/ReviewCard";
import PageNavigation from "../components/layout/PageNavigation";
import ReviewForm from "../components/reviews/ReviewForm";
import { useAuth } from "../context/AuthContext";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`/movies/${id}`);
        setMovie(res.data);

        const rev = await axios.get(`/movies/${id}/reviews`);
        setReviews(rev.data.results);

        if (user) {
          try {
            const wlRes = await axios.get(`/users/${user.id}/watchlist`);
            const watchlistIds = new Set(wlRes.data.map(item => item.movie._id));
            setIsInWatchlist(watchlistIds.has(id));
          } catch (wlErr) {
            console.error("Could not fetch watchlist status", wlErr);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, user]);

  const handleToggleWatchlist = async () => {
    if (!user) return; // Or redirect to login
    try {
      if (isInWatchlist) {
        await axios.delete(`/users/${user.id}/watchlist/${id}`);
      } else {
        await axios.post(`/users/${user.id}/watchlist`, { movieId: id });
      }
      setIsInWatchlist(!isInWatchlist);
    } catch (err) { console.error("Failed to update watchlist", err); }
  };

  const handleReviewSubmit = async (review) => {
    try {
      const { data } = await axios.post(`/movies/${id}/reviews`, review, { headers: { token: user.token } });
      setReviews((prev) => [data.review, ...prev]); // Use the review object from response
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const handleDeleteMovie = async () => {
    if (!window.confirm("Are you sure you want to delete this movie? This action cannot be undone.")) {
      return;
    }
    try {
      await axios.delete(`/movies/${id}`);
      alert("Movie deleted successfully.");
      navigate("/movies");
    } catch (err) {
      console.error("Failed to delete movie", err);
      alert(err.response?.data?.message || "Failed to delete movie.");
    }
  };

  if (loading) return <Loader />;
  if (!movie) return <div className="text-center text-gray-400 mt-12">Movie not found.</div>;

  const navigationPaths = [
    { name: "Home", to: "/" },
    { name: "Movies", to: "/movies" },
    { name: movie.title },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <PageNavigation paths={navigationPaths} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          {/* Left Column: Poster */}
          <div className="lg:col-span-4">
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title & Meta */}
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">{movie.title}</h1>
              <div className="flex flex-wrap items-center text-gray-400 text-sm space-x-3 mb-3">
                <span>{movie.releaseYear}</span>
                <span>&bull;</span>
                <span>{movie.genre?.join(", ")}</span>
              </div>
              {movie.averageRating != null && (
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-semibold text-yellow-400">{movie.averageRating.toFixed(1)} ★</span>
                  <span className="text-sm text-gray-400">({movie.reviewCount ?? 0} reviews)</span>
                </div>
              )}
            </div>

            {/* Actions */}
            {user && (
              <div className="flex items-center space-x-4 mt-4">
                <button
                  onClick={handleToggleWatchlist}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${isInWatchlist ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
                {user.isAdmin && (
                  <>
                    <Link
                      to={`/admin/edit-movie/${id}`}
                      className="px-6 py-3 rounded-lg font-semibold transition bg-yellow-600 hover:bg-yellow-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={handleDeleteMovie}
                      className="px-6 py-3 rounded-lg font-semibold transition bg-red-800 hover:bg-red-900"
                    >Delete</button>
                  </>
                )}
              </div>
            )}

            {/* Synopsis */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-2 text-white">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
            </div>

            {/* Review Form */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
              <ReviewForm onSubmit={handleReviewSubmit} />
            </div>

            {/* Reviews List */}
            <div className="space-y-6 mt-8">
              <h2 className="text-2xl font-bold">Reviews</h2>
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <ReviewCard key={rev._id} review={rev} />
                ))
              ) : (
                <p className="text-gray-400">No reviews yet. Be the first to write one!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
