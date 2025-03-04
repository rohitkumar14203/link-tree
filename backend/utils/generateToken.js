import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as cookie
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction, // Use secure cookies in production
    sameSite: isProduction ? 'none' : 'lax', // Required for cross-site cookies
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  
  // Also return the token in the response for header-based auth
  return token;
};

export default generateToken;
