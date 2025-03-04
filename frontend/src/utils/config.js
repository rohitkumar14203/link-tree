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
        // Set Authorization header with Bearer token
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Always include credentials for cross-origin requests
      config.withCredentials = true;
      
      // Add additional headers to help with CORS preflight
      config.headers['Access-Control-Allow-Origin'] = '*';
      config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      config.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, X-Request-With';
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Add response interceptor to handle common errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error('Authentication error:', error.response.data);
        // You could redirect to login page or refresh token here
      }
      return Promise.reject(error);
    }
  );
};