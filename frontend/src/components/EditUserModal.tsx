import React, { useState } from "react";
import { getToken } from "@/utils/auth";

interface Props {
    user: {
        id: number;
        username: string;
        role: string;
    };
    onClose: () => void;
    onSaved: () => void;
}

export default function EditUserModal({ user, onClose, onSaved }: Props) {
    const [role, setRole] = useState(user.role);

    const handleSave = async () => {
        const token = getToken();
        const res = await fetch(`http://localhost:3001/admin/users/${user.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ role }),
        });

        if (res.ok) {
            onSaved();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold text-center">Edit User</h2>

                <input
                    type="text"
                    value={user.username}
                    disabled
                    className="w-full border rounded px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                />

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border rounded px-4 py-2"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
