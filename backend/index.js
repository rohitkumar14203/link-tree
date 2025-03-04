import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import appearanceRoutes from "./routes/appearanceRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";
import { dirname } from "path";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");
const profilesDir = path.join(uploadsDir, "profiles");

// Create uploads directories if they don't exist
try {
  mkdirSync(uploadsDir, { recursive: true });
  mkdirSync(profilesDir, { recursive: true });
} catch (error) {
  console.error("Error creating upload directories:", error);
}

const app = express();

// Updated CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "https://link-tree-swart-eight.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/appearance", appearanceRoutes);
app.use("/api/analytics", analyticsRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
