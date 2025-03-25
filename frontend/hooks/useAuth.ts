import { useState, useEffect } from "react";

export function useAuth() {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        // In future you can plug in auto-refresh logic here
        setAccessToken(localStorage.getItem("accessToken")); // or switch to memory-based later
    }, []);

    return { accessToken, setAccessToken };
}
