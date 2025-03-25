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

            if (!token) {
                token = await refreshAccessToken();
            }

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
                storeToken(token);
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
        <div className={`${darkMode ? "bg-black text-white" : "bg-gray-100 text-black"} min-h-screen`}>
            <Navbar user={user} />

            <main className="max-w-3xl mx-auto mt-10 p-6">
                <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 space-y-6">
                    <h1 className="text-3xl font-bold text-center">🛠 Settings</h1>
                    <p className="text-center text-gray-700 dark:text-gray-300">
                        Manage your preferences and account settings below.
                    </p>

                    <section className="space-y-4">
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                            <p className="font-semibold text-gray-800 dark:text-white">Username:</p>
                            <p className="text-gray-600 dark:text-gray-300">{user?.username}</p>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                            <p className="font-semibold text-gray-800 dark:text-white">Role:</p>
                            <p className="text-gray-600 dark:text-gray-300 uppercase">{user?.role}</p>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 hover:scale-101"
                            >
                                {darkMode ? "🌞 Switch to Light Mode" : "🌙 Switch to Dark Mode"}
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
