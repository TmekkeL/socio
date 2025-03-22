import axios, { InternalAxiosRequestConfig } from "axios";
import { getToken, storeToken, removeToken } from "./auth";

const API = axios.create({
    baseURL: "http://localhost:3001", // ✅ Backend runs on 3001
    withCredentials: true,            // ✅ Ensures cookies are sent
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Automatically attach token to every request
API.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error("🚨 API Request Error:", error);
        return Promise.reject(error);
    }
);

// ✅ Refresh token logic
API.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.config.url}`, response.data);
        return response;
    },
    async (error) => {
        console.warn("🚨 API Response Error:", error.response?.status, error.response?.data);

        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.warn("🔄 Token expired! Attempting refresh...");
            originalRequest._retry = true;

            try {
                const refreshRes = await API.post("/auth/refresh", {}, { withCredentials: true });
                const { accessToken } = refreshRes.data;
                console.log("✅ New access token received:", accessToken);
                storeToken(accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                console.error("🚨 Refresh failed, redirecting to login.");
                removeToken();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;
