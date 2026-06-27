const getApiUrl = () => {
  // If an environment variable is explicitly provided, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In development, point to the local server
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:3002";
  }
  
  // In production, fallback to current origin where backend is served
  return window.location.origin;
};

export const API_URL = getApiUrl();
export default API_URL;
