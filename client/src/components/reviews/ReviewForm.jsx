import React, { useState } from 'react';

export default function ReviewForm({ onSubmit, initial = {} }) {
  const [rating, setRating] = useState(initial.rating || 5);
  const [text, setText] = useState(initial.text || '');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ rating, text });
    setLoading(false);
    setText(""); // Clear after submit
    setRating(5); // Reset rating
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Rating Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full rounded-md bg-gray-800 text-white border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ★
            </option>
          ))}
        </select>
      </div>

      {/* Textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Review</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Write your thoughts..."
          className="w-full rounded-md bg-gray-800 text-white border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-5 py-2 rounded-md shadow"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}
