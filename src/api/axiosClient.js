import { getAuthToken } from "../utils/auth";
import axios from "axios";

//建立BaseURL、header基礎結構
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  header: {
    "Content-Type": "application/json",
  },
});

//設定過濾器
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
