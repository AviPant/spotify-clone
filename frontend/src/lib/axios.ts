import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// ✅ Add this interceptor
AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or sessionStorage if you're using that
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});