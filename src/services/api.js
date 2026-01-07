import axios from "axios";

export const api = axios.create({
  baseURL: "https://backend-canova-crm.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("employeeToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
