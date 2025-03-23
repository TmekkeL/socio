// Path: src/utils/auth.ts
import API from "@/utils/api";

/** ✅ Stores access token in memory */
let accessToken: string | null = null;

export const storeToken = (token: string) => {
    if (!token) {
        console.error("🚨 Attempted to store an empty token!");
        return;
    }

    accessToken = token;
    console.log("✅ Token stored in memory:", accessToken);
    setupAutoLogoutTimer(token); // ⏳ Setup auto-logout when token is stored
};

export const getToken = () => accessToken;

export const removeToken = () => {
    console.log("🚪 Access token cleared from memory.");
    accessToken = null;
};

export const refreshAccessToken = async () => {
    try {
        console.log("🔄 Attempting to refresh access token...");
        const res = await API.post("/auth/refresh", {}, { withCredentials: true });

        if (!res.data?.accessToken) {
            throw new Error("Refresh failed: No access token.");
        }

        const newAccessToken = res.data.accessToken;
        console.log("✅ Access token refreshed:", newAccessToken);
        storeToken(newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error("🚨 Failed to refresh token:", error);
        removeToken();
        return null;
    }
};

/** ✅ Logout & redirect */
export const logout = async () => {
    try {
        await API.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
        console.error("⚠️ Logout request failed");
    }

    removeToken();
    window.location.href = "/login?loggedOut=true"; // ✅ Proper redirect after logout
};

/** 🔒 Secure fetch with auto-logout on 401 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
    };

    const res = await fetch(url, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        removeToken();
        window.location.href = "/login?loggedOut=true";
        return null;
    }

    return res;
};

/** ⏳ Setup automatic logout based on token expiration */
export const setupAutoLogoutTimer = (token: string) => {
    try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload));
        const expiry = decoded.exp * 1000;
        const now = Date.now();

        const delay = expiry - now;
        if (delay > 0) {
            console.log(`⏳ Auto-logout in ${Math.round(delay / 1000)}s`);
            setTimeout(() => {
                console.warn("⏰ Token expired — logging out.");
                removeToken();
                window.location.href = "/login?loggedOut=true";
            }, delay);
        }
    } catch (err) {
        console.error("❌ Failed to decode token for auto-logout.", err);
    }
};
