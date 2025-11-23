import axios from "axios";
import { API_WEB_URL } from "../constants/index";
import { getCookie } from "./cookie";
axios.defaults.withCredentials = true;
const API_WEB_BASE = "/backend";
const axiosClient = axios.create({
  baseURL: API_WEB_URL || `http://localhost:8000${API_WEB_BASE}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // List of public endpoints that don't require Authorization header
    const publicEndpoints = ["/auth/login", "/auth/register"];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // Only add Bearer token for authenticated endpoints
    if (!isPublicEndpoint) {
      const accessToken = getCookie("access_token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Log successful response for debugging
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClient;
