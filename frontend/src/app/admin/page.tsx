"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { getToken, refreshAccessToken, storeToken } from "@/utils/auth";

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            let token = getToken();

            if (!token) {
                token = await refreshAccessToken(); // ✅ fallback using refresh cookie
            }

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
                return;
            }

            storeToken(token); // ✅ restore access token in memory
            setUser(data);
            setLoading(false);
        };

        fetchUser();
    }, [router]);

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <Navbar user={user} />

            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
                <p>Welcome, {user?.username} (Admin)</p>

                <div className="mt-6">
                    <Link
                        href="/admin/users"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        ➕ Manage Users
                    </Link>
                </div>
            </div>
        </div>
    );
}
