"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { storeToken } from "@/utils/auth"; // ✅ in-memory token storage
import { toast } from "react-hot-toast"; // ✅ for feedback toasts

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        usernameRef.current?.focus();
        setFadeIn(true);

        const loggedOut = searchParams.get("loggedOut");
        if (loggedOut === "true") {
            setMessage("✅ You have been successfully logged out.");
        }
    }, [searchParams]);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setMessage("");
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:3001/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
                credentials: "include",
            });

            const data = await res.json();
            setIsLoading(false);

            if (!res.ok || !data.accessToken) {
                setError("Invalid credentials");
                toast.error("Login failed");
                return;
            }

            storeToken(data.accessToken);
            toast.success("Logged in successfully!");
            router.push("/dashboard");
        } catch (err) {
            console.error("🚨 Login error:", err);
            setIsLoading(false);
            setError("Something went wrong. Please try again.");
            toast.error("Something went wrong");
        }
    }

    return (
        <div
            className={`flex items-center justify-center min-h-screen px-4 transition-opacity duration-500 ease-in ${fadeIn ? "opacity-100" : "opacity-0"
                }`}
        >
            <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 space-y-4">
                <h1 className="text-3xl font-bold text-center">Login 🔐</h1>

                {message && (
                    <p className="text-green-600 text-center text-sm">{message}</p>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        ref={usernameRef}
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                        className="border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        className="border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                    {error && (
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    )}
                    <button
                        type="submit"
                        className={`bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition transform active:scale-95 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                                Logging in...
                            </div>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
