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
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm space-y-3">
        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}

        <label className="block text-sm font-medium">Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Your username"
        />

        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="you@example.com"
        />

        <label className="block text-sm font-medium">Profile picture URL</label>
        <input
          name="profilePicture"
          value={form.profilePicture}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="https://..."
        />

        <label className="block text-sm font-medium">New password (optional)</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Leave blank to keep current password"
        />

        <label className="block text-sm font-medium">Confirm password</label>
        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Repeat new password"
        />

        <div className="flex gap-2 justify-end">
          <Button type="button" onClick={() => navigate("/profile")} className="bg-gray-200 text-black">
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
