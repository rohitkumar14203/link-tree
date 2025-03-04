// Environment configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';

// Helper function to get profile image URL
export const getProfileImageUrl = (imageName) => {
  if (!imageName) return null;
  return `${UPLOADS_URL}/profiles/${imageName}`;
};