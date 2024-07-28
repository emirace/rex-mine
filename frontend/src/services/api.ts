import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
