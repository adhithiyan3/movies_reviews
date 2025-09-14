import React, { useState } from "react";
import axios from "../../api";
import Button from "../../components/ui/Button";

const AdminAddMovie = () => {
  const [title, setTitle] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [year, setYear] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/movies", {
        title,
        posterUrl,
        releaseYear: parseInt(year),
      });
      alert("Movie added successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add movie");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Add New Movie</h1>
      <form onSubmit={handleAdd} className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Poster URL"
          className="w-full p-2 border rounded"
          onChange={(e) => setPosterUrl(e.target.value)}
        />
        <input
          type="number"
          placeholder="Release Year"
          className="w-full p-2 border rounded"
          onChange={(e) => setYear(e.target.value)}
        />
        <Button type="submit" className="w-full">Add Movie</Button>
      </form>
    </div>
  );
};

export default AdminAddMovie;
