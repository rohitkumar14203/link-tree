// Environment configuration
export const API_URL = import.meta.env.VITE_API_URL || 'https://link-tree-egre.onrender.com/api';
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'https://link-tree-egre.onrender.com/uploads';

// Helper function to get profile image URL
export const getProfileImageUrl = (imageName) => {
  if (!imageName) return null;
  return `${UPLOADS_URL}/profiles/${imageName}`;
};

// Helper function to get auth token from localStorage
export const getAuthToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.token;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  return null;
};

// Configure axios defaults
export const configureAxios = (axios) => {
  axios.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.withCredentials = true;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};