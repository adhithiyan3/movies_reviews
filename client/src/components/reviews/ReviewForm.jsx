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
}


return (
<form onSubmit={submit} className="bg-white p-3 rounded shadow-sm">
<label className="block text-sm font-medium">Rating</label>
<select value={rating} onChange={e => setRating(Number(e.target.value))} className="mt-1 w-full rounded border px-2 py-1">
{[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ⭐</option>)}
</select>


<label className="block text-sm font-medium mt-3">Review</label>
<textarea value={text} onChange={e => setText(e.target.value)} rows={4} className="mt-1 w-full rounded border p-2" />


<div className="mt-3 flex justify-end">
<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Saving...' : 'Submit'}</button>
</div>
</form>
);
}