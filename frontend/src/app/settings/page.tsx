"use client";

import { useState } from "react";

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className={`p-6 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
            <h1 className="text-3xl font-bold">Settings</h1>
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="mt-4 p-2 bg-gray-700 text-white rounded"
            >
                Toggle Dark Mode
            </button>
        </div>
    );
}
