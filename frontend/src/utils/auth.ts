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
