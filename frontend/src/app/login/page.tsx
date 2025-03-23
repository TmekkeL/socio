"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { storeToken } from "@/utils/auth"; // ✅ FIXED: import missing!
import AdminUsersPage from "../page";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const usernameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }

        const loggedOut = searchParams.get("loggedOut");
        if (loggedOut === "true") {
            setMessage("✅ You have been successfully logged out.");
        }
    }, [searchParams]);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const res = await fetch("http://localhost:3001/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
                credentials: "include", // ✅ enables cookie!
            });

            if (!res.ok) {
                setError("Invalid credentials");
                return;
            }

            const { accessToken } = await res.json();
            storeToken(accessToken); // ✅ Store in memory

            router.push("/dashboard");
        } catch (err) {
            console.error("🚨 Login error:", err);
            setError("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-2xl font-bold mb-2">Login</h1>

            {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    ref={usernameRef}
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="border border-gray-300 rounded-md p-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="border border-gray-300 rounded-md p-2"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
                    Login
                </button>
            </form>
        </div>
    );
}
