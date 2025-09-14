import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "../../api";
import WatchlistCard from "../../components/movies/WatchlistCard";
import ReviewCard from "../../components/reviews/ReviewCard";

const Profile = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/users/${user.id}`);
        setReviews(res.data.reviews);

        const wl = await axios.get(`/users/${user.id}/watchlist`);
        setWatchlist(wl.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (!user) return <p className="p-4">Please log in to view profile.</p>;

  return (
    <div className="p-4">
      {/* Header section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{user.username}’s Profile</h1>
        <Link
          to="/profile/edit"
          className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Edit Profile
        </Link>
      </div>

      {/* Watchlist */}
      <h2 className="text-lg font-semibold mt-4">Your Watchlist</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
        {watchlist.map((item) => (
          <WatchlistCard key={item.id} item={item} />
        ))}
      </div>

      {/* Reviews */}
      <h2 className="text-lg font-semibold mt-6">Your Reviews</h2>
      <div className="space-y-2 mt-2">
        {reviews.map((rev) => (
          <ReviewCard key={rev._id} review={rev} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
