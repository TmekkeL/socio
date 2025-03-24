"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { getToken, refreshAccessToken, storeToken } from "@/utils/auth";
import { secureFetch } from "@/utils/secureFetch";
import { UserCog, Users, Settings as SettingsIcon } from "lucide-react"; // ✅ Lucide icons

export default function AdminPage() {
    const router = useRouter();
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

            const res = await secureFetch("http://localhost:3001/auth/me");

            if (res.status === 401) {
                router.push("/login?loggedOut=true");
                return;
            }

            const data = await res.json();

            if (data.role !== "admin") {
                router.push("/dashboard");
                return;
            }

            storeToken(token);
            setUser(data);
            setLoading(false);
        };

        fetchUser();
    }, [router]);

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <Navbar user={user} />

            <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 space-y-6">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                    <UserCog className="w-7 h-7 text-blue-600" />
                    Admin Panel
                </h1>

                <p className="text-center text-gray-700 dark:text-gray-300">
                    Welcome, <span className="font-semibold">{user?.username}</span> (admin)
                </p>

                <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4">
                    <h2 className="text-xl font-semibold mb-2">Admin Tools</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Use the tools below to manage users and monitor the system.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/admin/users"
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-transform duration-200 hover:scale-101"
                    >
                        <Users className="w-5 h-5" />
                        Manage Users
                    </Link>
                    <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-md cursor-not-allowed"
                    >
                        <SettingsIcon className="w-5 h-5" />
                        System Logs (Coming Soon)
                    </button>
                </div>
            </div>
        </div>
    );
}
