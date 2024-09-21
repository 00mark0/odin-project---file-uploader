import axios from "axios";

// Create an instance of axios with the base URL
const api = axios.create({
  baseURL: "/api", // This will be proxied to the backend server
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
