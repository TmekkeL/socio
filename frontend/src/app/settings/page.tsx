"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function SettingsPage() {
    const router = useRouter();
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                router.push("/login");
                return;
            }

            const res = await fetch("http://localhost:3001/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                router.push("/login");
                return;
            }

            const data = await res.json();
            setUser(data);
        };

        fetchUser();
    }, []);

    return (
        <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
            {user && <Navbar user={user} />}

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
