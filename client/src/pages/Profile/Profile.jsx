import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "../../api";
import Loader from "../../components/ui/Loader";
import WatchlistCard from "../../components/movies/WatchlistCard";
import ReviewCard from "../../components/reviews/ReviewCard";

const Profile = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/users/${user.id}`);
        setReviews(res.data.reviews);

        const wl = await axios.get(`/users/${user.id}/watchlist`);
        setWatchlist(wl.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await axios.delete(`/users/${user.id}/watchlist/${movieId}`);
      setWatchlist((prev) => prev.filter((item) => item.movie._id !== movieId));
    } catch (err) {
      console.error("Failed to remove from watchlist", err);
    }
  };

  if (!user) return <p className="p-4 text-white">Please log in to view profile.</p>;

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto p-4 text-white">
      <div className="flex flex-col sm:flex-row items-start gap-8">
        {/* Profile Header */}
        <div className="flex-shrink-0 w-full sm:w-48 text-center">
          <div className="w-32 h-32 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center text-4xl font-bold">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span>{user.username?.[0]?.toUpperCase()}</span>
            )}
          </div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-sm text-gray-400">{user.email}</p>
          <Link
            to="/profile/edit"
            className="mt-4 inline-block px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Edit Profile
          </Link>
          {user.isAdmin && (
            <Link
              to="/admin/add-movie"
              className="mt-2 inline-block px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Add Movie
            </Link>
          )}
        </div>

        <div className="flex-1 w-full">
          {/* Watchlist */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Watchlist</h2>
            {watchlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {watchlist.map((item) => (
                  <WatchlistCard key={item.id} movie={item.movie} onRemove={() => handleRemoveFromWatchlist(item.movie._id)} />
                ))}
              </div>
            ) : <p className="text-gray-400">Your watchlist is empty.</p>}
          </div>

          {/* Reviews */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Your Reviews</h2>
            <div className="space-y-4">
              {reviews.map((rev) => (
                <ReviewCard key={rev._id} review={rev} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
