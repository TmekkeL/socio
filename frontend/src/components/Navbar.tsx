"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
    user: { username: string; role: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
    const pathname = usePathname();

    const linkStyle = (href: string) =>
        `px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${pathname === href ? "bg-blue-500 text-white dark:bg-blue-700" : ""
        }`;

    return (
        <nav className="bg-white dark:bg-gray-900 shadow p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {user && (
                    <>
                        <Link href="/dashboard" className={linkStyle("/dashboard")}>
                            Dashboard
                        </Link>
                        {user.role === "admin" && (
                            <Link href="/admin" className={linkStyle("/admin")}>
                                Admin
                            </Link>
                        )}
                        <Link href="/settings" className={linkStyle("/settings")}>
                            Settings
                        </Link>
                    </>
                )}
            </div>

            {user && (
                <form action="/logout" method="POST">
                    <button
                        type="submit"
                        className="text-red-500 hover:underline"
                        onClick={() => {
                            localStorage.removeItem("accessToken");
                            window.location.href = "/login?loggedOut=true";
                        }}
                    >
                        Logout
                    </button>
                </form>
            )}
        </nav>
    );
}
