"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");

        const res = await fetch("http://localhost:3001/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (!res.ok) {
            setError("Username already taken");
            return;
        }

        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">Sign Up</h1>
            <form onSubmit={handleSignup} className="flex flex-col gap-4 mt-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="border p-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="border p-2"
                />
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <button type="submit" className="bg-blue-500 text-white p-2">Sign Up</button>
            </form>
        </div>
    );
}
