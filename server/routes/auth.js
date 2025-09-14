const express = require('express');
const router = express.Router();
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Schemas
const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  isAdmin: z.boolean().optional().default(false)
});


const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

// Register route
router.post('/register', async (req, res) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ 
      message: validation.error.errors[0].message 
    });
  }

  const value = validation.data;

  const existing = await User.findOne({ 
    $or: [{ email: value.email }, { username: value.username }] 
  });
  if (existing) return res.status(400).json({ message: 'Email or username already in use' });

  const user = new User(value);
  await user.save();

  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { 
    expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
  });

  res.status(201).json({ 
    token, 
    user: { id: user._id, username: user.username, email: user.email } 
  });
});

// Login route
router.post('/login', async (req, res) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ message: validation.error.errors[0].message });
  }

  const { email, password } = validation.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid email or password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  });

  return res.status(200).json({
    token,
    user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin },
    message: "Login successful"
  });
});


module.exports = router;
