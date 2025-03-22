"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
    const router = useRouter();
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
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            {/* ✅ Role-based Navbar (shows Admin links if role === "admin") */}
            <Navbar user={user} />

            <div className="p-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                {user ? (
                    <p>Welcome, {user.username} ({user.role})</p>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}
