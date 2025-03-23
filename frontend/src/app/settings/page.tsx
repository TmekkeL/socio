// Path: src/app/settings/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import { getToken, refreshAccessToken, storeToken } from "@/utils/auth";

export default function SettingsPage() {
    const router = useRouter();
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            let token = getToken();

            // 🔄 Try to refresh if no token in memory
            if (!token) {
                token = await refreshAccessToken();
            }

            // ❌ Still no token? Redirect to login
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch("http://localhost:3001/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch user");
                }

                const data = await res.json();
                storeToken(token); // ✅ Re-store in memory after refresh
                setUser(data);
                setLoading(false);
            } catch (error) {
                console.error("⚠️ Failed to fetch /auth/me:", error);
                router.push("/login");
            }
        };

        fetchUser();
    }, [router]);

    if (loading) return <Spinner />;

    return (
        <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
            <Navbar user={user} />

            <div className="p-6">
                <h1 className="text-3xl font-bold">Settings</h1>

                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="mt-4 p-2 bg-gray-700 text-white rounded"
                >
                    Toggle Dark Mode
                </button>
            </div>
        </div>
    );
}
