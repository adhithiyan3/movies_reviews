export default function ReviewCard({ review }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md">
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
          {review.userId?.profilePicture ? (
            <img
              src={review.userId.profilePicture}
              alt={review.userId.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{review.userId?.username?.[0]?.toUpperCase() || "U"}</span>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="text-sm font-semibold text-white">
            {review.userId?.username || "Anonymous"}
          </div>
          <div className="text-xs text-gray-400">
            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "—"}
          </div>
        </div>

        {/* Rating */}
        <div className="text-yellow-400 font-semibold text-sm">
          {review.rating} <span className="text-sm">★</span>
        </div>
      </div>

      {/* Review Text */}
      {review.text && (
        <p className="mt-3 text-gray-300 text-sm leading-relaxed">
          {review.text}
        </p>
      )}
    </div>
  );
}
