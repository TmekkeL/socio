import API from "@/utils/api";

/** ✅ Stores access token in memory */
let accessToken: string | null = null;

/** ✅ Stores access token in memory */
export const storeToken = (token: string) => {
    if (!token) {
        console.error("🚨 Attempted to store an empty token!");
        return;
    }
    accessToken = token;
    console.log("✅ Token successfully stored in memory:", accessToken);
};

/** ✅ Retrieves access token */
export const getToken = () => accessToken;

/** ✅ Removes access token from memory */
export const removeToken = () => {
    console.log("🚨 Token removed from memory.");
    accessToken = null;
};

/** 🔄 ✅ Requests a new access token using refresh token */
export const refreshAccessToken = async () => {
    try {
        console.log("🔄 Attempting to refresh access token...");

        const res = await API.post("/auth/refresh", {}, { withCredentials: true });

        if (!res.data?.accessToken) {
            throw new Error("Refresh failed: No new access token received.");
        }

        const newAccessToken = res.data.accessToken;
        console.log("✅ New access token received:", newAccessToken);

        storeToken(newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error("🚨 Failed to refresh access token:", error);
        removeToken();
        return null;
    }
};

/** 🚪 ✅ Logs out the user */
export const logout = async () => {
    try {
        await API.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
        console.error("⚠️ Logout request failed.");
    }
    removeToken();
};
