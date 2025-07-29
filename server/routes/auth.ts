import { RequestHandler } from "express";
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@shared/auth";

// In-memory storage for demo purposes
const users: User[] = [
  {
    id: "demo-user-1",
    email: "demo@example.com",
    name: "Demo User",
    createdAt: new Date(),
  },
];

const passwords: Record<string, string> = {
  "demo@example.com": "password123",
};

// Simple token storage (in production, use JWT or proper session management)
const tokens: Record<string, User> = {};

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = users.find((u) => u.email === email);
    if (!user || passwords[email] !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken();
    tokens[token] = user;

    const response: AuthResponse = {
      user,
      token,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleRegister: RequestHandler = (req, res) => {
  try {
    const { email, password, name }: RegisterRequest = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name are required" });
    }

    if (users.find((u) => u.email === email)) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      createdAt: new Date(),
    };

    users.push(newUser);
    passwords[email] = password;

    const token = generateToken();
    tokens[token] = newUser;

    const response: AuthResponse = {
      user: newUser,
      token,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleVerifyToken: RequestHandler = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const user = tokens[token];

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleLogout: RequestHandler = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      delete tokens[token];
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Middleware to authenticate requests
export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.substring(7);
  const user = tokens[token];

  if (!user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Add user to request object
  (req as any).user = user;
  next();
};
