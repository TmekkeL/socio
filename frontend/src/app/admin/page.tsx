"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AdminPage() {
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
            if (data.role !== "admin") {
                router.push("/dashboard");
            } else {
                setUser(data);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            {user && <Navbar user={user} />}

            <div className="p-6">
                <h1 className="text-3xl font-bold">Admin Panel</h1>
                {user ? (
                    <p>Welcome, {user.username} (Admin)</p>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}
