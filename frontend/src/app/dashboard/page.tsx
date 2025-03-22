"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                router.push("/login");
                return;
            }

            const start = performance.now(); // ⏱️ Start timer

            const res = await fetch("http://localhost:3001/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const end = performance.now(); // ⏱️ End timer
            console.log(`⏱️ /auth/me fetch took ${Math.round(end - start)}ms`);

            if (!res.ok) {
                router.push("/login");
                return;
            }

            const data = await res.json();
            setUser(data);
            setLoading(false);
        };

        fetchUser();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <Navbar user={user} />

            <div className="p-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p>Welcome, {user?.username} ({user?.role})</p>
            </div>
        </div>
    );
}
