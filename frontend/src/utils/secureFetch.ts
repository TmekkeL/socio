// Path: src/utils/secureFetch.ts
import { getToken, storeToken, refreshAccessToken } from "./auth";

export async function secureFetch(input: RequestInfo, init: RequestInit = {}) {
    let token = getToken();

    const authHeaders = token
        ? { Authorization: `Bearer ${token}` }
        : {};

    const res = await fetch(input, {
        ...init,
        credentials: "include",
        headers: {
            ...init.headers,
            ...authHeaders,
            "Content-Type": "application/json",
        },
    });

    if (res.status !== 401) return res;

    // Try refreshing token
    const newToken = await refreshAccessToken();
    if (!newToken) {
        return res; // Let calling code handle logout
    }

    storeToken(newToken);

    // Retry original request with new token
    return fetch(input, {
        ...init,
        credentials: "include",
        headers: {
            ...init.headers,
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
        },
    });
}
