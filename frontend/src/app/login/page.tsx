"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const usernameRef = useRef<HTMLInputElement>(null); // ✅ For auto-focus

    useEffect(() => {
        // ✅ Autofocus the username field
        if (usernameRef.current) {
            usernameRef.current.focus();
        }

        // ✅ Show message if redirected after logout
        const loggedOut = searchParams.get("loggedOut");
        if (loggedOut === "true") {
            setMessage("✅ You have been successfully logged out.");
        }
    }, [searchParams]);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setMessage("");

        const res = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (!res.ok) {
            setError("Invalid credentials");
            return;
        }

        const { accessToken } = await res.json();
        localStorage.setItem("accessToken", accessToken); // Replace later with in-memory storage if needed

        router.push("/dashboard");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-2xl font-bold mb-2">Login</h1>

            {message && (
                <p className="text-green-600 text-sm mb-2">
                    {message}
                </p>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    ref={usernameRef} // ✅ Attach auto-focus ref
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
