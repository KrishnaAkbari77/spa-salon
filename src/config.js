const getApiUrl = () => {
  // 1. If an environment variable is explicitly provided, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 2. In local development, point to the local server port
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:3000";
  }
  
  // 3. In production (Netlify), default to your Render backend URL
  return "https://spa-salon-d24l.onrender.com";
};

export const API_URL = getApiUrl();
export default API_URL;
