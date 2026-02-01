import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
  timeout: 10000, // 10 second timeout
});

// Add token interceptor for authenticated requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    return response; // Return the full response object
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }
    return Promise.reject(error);
  }
);

export default API;
