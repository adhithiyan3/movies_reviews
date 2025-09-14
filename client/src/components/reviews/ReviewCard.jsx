export default function ReviewCard({ review }) {
return (
<div className="bg-white rounded p-3 shadow-sm">
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
{review.userId?.profilePicture ? (
<img src={review.userId.profilePicture} alt={review.userId.username} className="w-full h-full object-cover" />
) : (
<div className="w-full h-full flex items-center justify-center text-gray-400">U</div>
)}
</div>
<div>
<div className="text-sm font-semibold">{review.userId?.username}</div>
<div className="text-xs text-gray-400">
  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "—"}
</div>

</div>
<div className="ml-auto font-medium">{review.rating} ⭐</div>
</div>
{review.text && <p className="mt-3 text-sm text-gray-700">{review.text}</p>}
</div>
);
}