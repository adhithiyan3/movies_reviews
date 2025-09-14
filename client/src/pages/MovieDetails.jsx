import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api";
import Loader from "../components/ui/Loader";
import ReviewCard from "../components/reviews/ReviewCard";
import PageNavigation from "../components/layout/PageNavigation";
import ReviewForm from "../components/reviews/ReviewForm";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`/movies/${id}`);
        setMovie(res.data);

        const rev = await axios.get(`/movies/${id}/reviews`);
        setReviews(rev.data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleReviewSubmit = async (review) => {
    try {
      const { data } = await axios.post(`/movies/${id}/reviews`, review);
      setReviews((prev) => [data, ...prev]);
    } catch (err) {
      console.error("Error submitting review:", err);
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
