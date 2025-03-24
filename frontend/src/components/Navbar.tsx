"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/utils/auth";
import {
    LayoutDashboard,
    Shield,
    Settings as SettingsIcon,
    LogOut,
} from "lucide-react";

interface NavbarProps {
    user: { username: string; role: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
    const pathname = usePathname();

    const linkStyle = (href: string) =>
        `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${pathname === href ? "bg-blue-500 text-white dark:bg-blue-700" : ""
        }`;

    return (
        <nav className="bg-white dark:bg-gray-900 shadow p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {user && (
                    <>
                        <Link href="/dashboard" className={linkStyle("/dashboard")}>
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </Link>
                        {user.role === "admin" && (
                            <Link href="/admin" className={linkStyle("/admin")}>
                                <Shield className="w-5 h-5" />
                                Admin
                            </Link>
                        )}
                        <Link href="/settings" className={linkStyle("/settings")}>
                            <SettingsIcon className="w-5 h-5" />
                            Settings
                        </Link>
                    </>
                )}
            </div>

            {user && (
                <button
                    onClick={logout}
                    className="text-red-500 hover:underline flex items-center gap-1"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            )}
        </nav>
    );
}
