// Environment configuration
export const API_URL = import.meta.env.VITE_API_URL || 'https://link-tree-egre.onrender.com/api';
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'https://link-tree-egre.onrender.com/uploads';

// Helper function to get profile image URL
export const getProfileImageUrl = (imageName) => {
  if (!imageName) return null;
  return `${UPLOADS_URL}/profiles/${imageName}`;
};