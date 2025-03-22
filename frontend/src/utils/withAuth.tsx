"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, refreshAccessToken, removeToken } from "@/utils/auth";
import API from "@/utils/api";

const withAuth = (WrappedComponent: any, allowedRoles: string[] = []) => {
    return function ProtectedRoute(props: any) {
        const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null);
        const [loading, setLoading] = useState(true);
        const router = useRouter();
        let refreshInterval: NodeJS.Timeout | null = null;
        let isFetching = false;
        let firstRefreshDone = false;

        useEffect(() => {
            let isMounted = true;
            const token = getToken();

            if (!token) {
                console.warn("🚨 No token found! Redirecting to login...");
                removeToken();
                router.replace("/login");
                return;
            }

            const fetchUser = async (accessToken: string) => {
                if (isFetching) return;
                isFetching = true;

                try {
                    console.log("🔍 Fetching user from backend...");
                    const res = await API.get("/auth/me", {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        withCredentials: true,
                    });

                    if (isMounted) {
                        console.log("✅ User authenticated:", res.data);
                        setUser(res.data);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error("🚨 Authentication failed. Trying refresh...", error);
                    if (isMounted) attemptRefresh();
                } finally {
                    isFetching = false;
                }
            };

            const attemptRefresh = async () => {
                try {
                    console.log("🔄 Attempting token refresh...");
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        console.log("✅ Token refreshed successfully.");
                        fetchUser(newToken);
                    } else {
                        throw new Error("Token refresh failed");
                    }
                } catch (error) {
                    console.error("🚨 Refresh failed. Redirecting to login...", error);
                    removeToken();
                    if (isMounted) {
                        setUser(null);
                        router.replace("/login");
                    }
                }
            };

            fetchUser(token).then(() => {
                setTimeout(() => {
                    if (!firstRefreshDone && !user) {
                        console.log("⏳ First refresh after 500ms...");
                        attemptRefresh();
                        firstRefreshDone = true;
                    }
                }, 500);
            });

            refreshInterval = setInterval(() => {
                if (firstRefreshDone) {
                    console.log("🔄 Refreshing token every 60s...");
                    attemptRefresh();
                }
            }, 60000);

            return () => {
                isMounted = false;
                if (refreshInterval) clearInterval(refreshInterval);
            };
        }, []);

        useEffect(() => {
            if (user === null && !loading) {
                console.warn("🚨 User is null, redirecting to login...");
                removeToken();
                router.replace("/login");
            }
        }, [user]);

        if (loading) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <h2 className="text-xl font-semibold">Authenticatie controleren...</h2>
                </div>
            );
        }

        if (!user) {
            return (
                <div className="flex items-center justify-center min-h-screen text-center">
                    <h2 className="text-xl font-semibold text-red-500">🚨 Fout: Gebruiker niet gevonden.</h2>
                    <p className="text-gray-600 mt-2">Probeer de pagina te verversen of opnieuw in te loggen.</p>
                    <button
                        onClick={() => router.replace("/login")}
                        className="mt-4 px-4 py-2 text-lg text-white bg-red-600 hover:bg-red-700 rounded-md shadow-md transition"
                    >
                        Ga naar Login
                    </button>
                </div>
            );
        }

        return <WrappedComponent {...props} user={user} />;
    };
};

export default withAuth;
