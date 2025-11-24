import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleRegister,
  handleVerifyToken,
  handleLogout,
  authenticateToken,
} from "./routes/auth";
import { getTasks, createTask, updateTask, deleteTask } from "./routes/tasks";
// Import the payroll handler (No .ts extension needed)
import { handlePayrollCalculation } from "./routes/payroll";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // --- Example API routes ---
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // --- Payroll Route ---
  // Endpoint for payroll calculations
  app.post("/api/payroll", handlePayrollCalculation);

  // --- Authentication routes ---
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/register", handleRegister);
  app.get("/api/auth/verify", handleVerifyToken);
  app.post("/api/auth/logout", handleLogout);

  // --- Protected task routes ---
  app.get("/api/tasks", authenticateToken, getTasks);
  app.post("/api/tasks", authenticateToken, createTask);
  app.put("/api/tasks/:id", authenticateToken, updateTask);
  app.delete("/api/tasks/:id", authenticateToken, deleteTask);

  return app;
}