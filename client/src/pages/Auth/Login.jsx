import React, { useState } from "react";
import axios from "../../api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";



const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    console.log("Attempting login with email:", email);
    const res = await axios.post("/auth/login", { email, password });

    if (res.status === 200) {
      console.log("Login response:", res.data);
      login(res.data.token, res.data.user); // store token + user
      alert("Login successful");
    } else {
      alert(res.data?.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
