"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import { getToken } from "@/utils/auth";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = getToken();
            if (!token) {
                setLoading(false);
                router.push("/login");
                return;
            }

            const start = performance.now();
            const res = await fetch("http://localhost:3001/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const end = performance.now();
            console.log(`⏱️ /auth/me fetch took ${Math.round(end - start)}ms`);

            if (!res.ok) {
                setLoading(false);
                router.push("/login");
                return;
            }

            const data = await res.json();
            setUser(data);
            setLoading(false);
        };

        fetchUser();
    }, [router]);

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <Navbar user={user} />

            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl mt-10 p-6 space-y-4">
                <h1 className="text-3xl font-bold text-center">📊 Dashboard</h1>
                <p className="text-center text-gray-700 dark:text-gray-300">
                    Welcome back, <span className="font-semibold">{user?.username}</span>!
                </p>
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your role:{" "}
                        <span className="uppercase font-medium">{user?.role}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
