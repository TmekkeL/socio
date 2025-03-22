"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <div className="text-xl font-bold">Socio Admin</div>
            <div className="space-x-4">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                <Link href="/admin" className="hover:underline">Admin</Link>
                <Link href="/settings" className="hover:underline">Settings</Link>
                <Link href="/logout" className="hover:underline text-red-400">Logout</Link>
            </div>
        </nav>
    );
}
