"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";
import { getToken } from "@/utils/auth";

interface User {
    id: number;
    username: string;
    role: string;
    created_at: string;
    is_active?: boolean;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState({ username: "", password: "" });

    useEffect(() => {
        const fetchCurrentUserAndUsers = async () => {
            const token = getToken();
            if (!token) {
                router.push("/login");
                return;
            }

            const resMe = await fetch("http://localhost:3001/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!resMe.ok) {
                router.push("/login");
                return;
            }

            const currentUser = await resMe.json();
            setUser(currentUser);

            if (currentUser.role !== "admin") {
                router.push("/dashboard");
                return;
            }

            await fetchUsers();
            setLoading(false);
        };

        fetchCurrentUserAndUsers();
    }, [router]);

    const fetchUsers = async () => {
        const token = getToken();
        const res = await fetch("http://localhost:3001/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            const data = await res.json();
            setUsers(data);
        }
    };

    const handleDelete = async (userId: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const token = getToken();
        const res = await fetch(`http://localhost:3001/admin/users/${userId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) await fetchUsers();
    };

    const handleToggleRole = async (user: User) => {
        const token = getToken();
        const newRole = user.role === "admin" ? "user" : "admin";

        const res = await fetch(`http://localhost:3001/admin/users/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ role: newRole }),
        });

        if (res.ok) await fetchUsers();
    };

    const handleAddUser = async () => {
        if (!newUser.username || !newUser.password) return;

        const res = await fetch("http://localhost:3001/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
            credentials: "include",
        });

        if (res.ok) {
            await fetchUsers();
            setNewUser({ username: "", password: "" });
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <Navbar user={user} />
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4" role="heading">User Management</h1>

                {/* Add User Form */}
                <div className="mb-6 flex gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="border p-2 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="border p-2 rounded"
                    />
                    <button
                        onClick={handleAddUser}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add User
                    </button>
                </div>

                {/* Users Table */}
                <table className="w-full border border-gray-300 dark:border-gray-700">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-800">
                            <th className="p-2 text-left">ID</th>
                            <th className="p-2 text-left">Username</th>
                            <th className="p-2 text-left">Role</th>
                            <th className="p-2 text-left">Created</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-t border-gray-300 dark:border-gray-700">
                                <td className="p-2">{u.id}</td>
                                <td className="p-2">{u.username}</td>
                                <td className="p-2">{u.role}</td>
                                <td className="p-2">{new Date(u.created_at).toLocaleString()}</td>
                                <td className="p-2 space-x-2">
                                    <button
                                        onClick={() => handleToggleRole(u)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    >
                                        Toggle Role
                                    </button>
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
