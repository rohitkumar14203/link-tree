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
import { dirname } from "path"; // Add this import
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");
const profilesDir = path.join(uploadsDir, "profiles");
const port = process.env.PORT || 5000;
const app = express();

connectDB();

// Updated CORS configuration with additional options
app.use(
  cors({
    origin: "https://link-tree-swart-eight.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Cache-Control",
      "Accept",
    ],
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Ensure uploads directory exists
import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Create uploads directories if they don't exist
try {
  mkdirSync(uploadsDir, { recursive: true });
  mkdirSync(profilesDir, { recursive: true });
  console.log("Upload directories created successfully");
} catch (error) {
  console.error("Error creating upload directories:", error);
}

// Routes
app.use("/api/users", userRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/appearance", appearanceRoutes);
app.use("/api/analytics", analyticsRoutes); // Fixed: removed duplicate

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Add a simple health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
