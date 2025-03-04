import jwt from "jsonwebtoken";
import User from "../modal/userModal.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  // Check for token in cookies first
  let token = req.cookies.jwt;
  
  // If no token in cookies, check Authorization header
  if (!token && req.headers.authorization) {
    // Handle both "Bearer token" and just "token" formats
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = authHeader;
    }
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export default authenticate;
