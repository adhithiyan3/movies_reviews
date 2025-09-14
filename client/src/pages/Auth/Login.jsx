import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
    const res = await axios.post("/auth/login", { email, password });

    if (res.status === 200) {
      login(res.data.token, res.data.user); // store token + user
      navigate("/profile"); // Redirect to profile page on successful login
    } else {
      // This block might be unreachable if axios throws for non-2xx status
      setError(res.data?.message || "Login failed");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed. Please check your credentials.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-900 text-white">
      <div className="p-8 max-w-sm w-full bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 text-red-400 rounded-md text-sm">{error}</div>
          )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full !mt-6 bg-blue-600 hover:bg-blue-700" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">Sign up</Link>
        </p>
      </form>
      </div>
    </div>
  );
};

export default Login;
