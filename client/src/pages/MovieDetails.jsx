import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api";
import Loader from "../components/ui/Loader";
import ReviewCard from "../components/reviews/ReviewCard";
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

  // ✅ function to handle new review submission
  const handleReviewSubmit = async (review) => {
    try {
      const { data } = await axios.post(`/movies/${id}/reviews`, review);
      setReviews((prev) => [data, ...prev]); // update reviews immediately
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  if (loading) return <Loader />;

  if (!movie) return <p className="p-4">Movie not found.</p>;

  return (
    <div className="p-4">
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full max-w-sm mx-auto rounded-lg shadow mb-4"
      />
      <h1 className="text-2xl font-bold">{movie.title}</h1>
      <p className="mt-2 text-gray-700">{movie.synopsis}</p>

      <h2 className="mt-6 text-lg font-semibold">Reviews</h2>

      {/* ✅ Pass the handler to ReviewForm */}
      <ReviewForm onSubmit={handleReviewSubmit} />

     <div className="mt-4 space-y-2">
  {reviews.map((rev) => (
    <ReviewCard key={rev._id} review={rev} />
  ))}
</div>

    </div>
  );
};

export default MovieDetails;
