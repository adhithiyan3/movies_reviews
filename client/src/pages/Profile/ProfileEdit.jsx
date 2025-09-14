// src/pages/Profile/ProfileEdit.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";   
import Button from "../../components/ui/Button";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();   

  const [form, setForm] = useState({
    username: "",
    email: "",
    profilePicture: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setForm((f) => ({
      ...f,
      username: user.username || "",
      email: user.email || "",
      profilePicture: user.profilePicture || "",
    }));
  }, [user, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const payload = {};
    if (form.username && form.username !== user.username) payload.username = form.username;
    if (form.email && form.email !== user.email) payload.email = form.email;
    if (form.profilePicture !== (user.profilePicture || "")) payload.profilePicture = form.profilePicture;
    if (form.password) payload.password = form.password;

    if (Object.keys(payload).length === 0) {
      setError("No changes to save.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.put(`/users/${user.id}`, payload ,{
        headers: {
            token: user.token
        }
      });
      console.log("Update response:", res.data);
      const updatedUser = res.data.user ?? null;
      if (updatedUser) {
        setUser((prev) => ({ ...prev, ...updatedUser }));
        setSuccess("Profile updated successfully.");
        setForm((s) => ({ ...s, password: "", confirmPassword: "" }));
        navigate("/profile");
      } else {
        setSuccess(res.data.message || "Profile updated.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <main className="max-w-2xl mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 space-y-4">
        {error && <div className="p-3 bg-red-500/20 text-red-400 rounded-md text-sm">{error}</div>}
        {success && <div className="p-3 bg-green-500/20 text-green-400 rounded-md text-sm">{success}</div>}

        <label className="block text-sm font-medium text-gray-300">Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your username"
        />

        <label className="block text-sm font-medium text-gray-300">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
        />

        <label className="block text-sm font-medium text-gray-300">Profile picture URL</label>
        <input
          name="profilePicture"
          value={form.profilePicture}
          onChange={handleChange}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://..."
        />

        <label className="block text-sm font-medium text-gray-300">New password (optional)</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Leave blank to keep current password"
        />

        <label className="block text-sm font-medium text-gray-300">Confirm password</label>
        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Repeat new password"
        />

        <div className="flex gap-4 justify-end pt-4">
          <Button type="button" onClick={() => navigate("/profile")} className="bg-gray-600 hover:bg-gray-500 text-white">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-blue-600 text-white">
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </main>
  );
}
