"use client";

import { useEffect, useState } from "react";
import { Trash2, Settings } from "lucide-react";
import { delAccount, fetchAllUser, toggleAccountLock } from "@/api/user";

interface UserInfo {
  user_id: number;
  username: string;
  email: string;
  role: string; // ví dụ: ["Admin", "User"]
  avatar_url?: string;
  is_locked: boolean;
}

const RoleBadge = ({ role }: { role: string }) => {
  const colors: Record<string, string> = {
    admin: "bg-green-600",
    manager: "bg-yellow-500",
    user: "bg-emerald-600",
  };

  return (
    <span
      className={`text-white px-2 py-1 text-sm rounded-full ${colors[role]}`}
    >
      {role}
    </span>
  );
};

const deleteAccount = async (user_id: number) => {
  await delAccount(user_id);
  location.reload();
};

export default function AdminUserList() {
  const [users, setUsers] = useState<UserInfo[]>([]);

  useEffect(() => {
    const getuser = async () => {
      try {
        const res = await fetchAllUser();
        setUsers(res);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    getuser();
  }, []);

  console.log("Các thông tin user: ", users);

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Quản lý người dùng</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Tên</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-t">
                {/* Name column */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="mr-2" />
                    <img
                      src={u.avatar_url}
                      alt={u.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{u.username}</p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>

                {/* Role column */}
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <RoleBadge key={u.role} role={u.role} />
                  </div>
                </td>

                {/* Actions column */}
                <td className="p-3">
                  <div className="flex space-x-4">
                    <button
                      className="flex items-center text-sm text-yellow-600 hover:text-yellow-800 transition"
                      onClick={async () => {
                        await toggleAccountLock(u.user_id);
                        location.reload(); // hoặc gọi lại fetchAllUser()
                      }}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      {u.is_locked ? "Mở tài khoản" : "Khoá tài khoản"}
                    </button>

                    <button
                      className="flex items-center text-sm text-red-600 hover:text-red-800 transition"
                      onClick={() => deleteAccount(u.user_id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xoá tài khoản
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <p className="text-sm text-gray-500 mt-3">
          Showing {users.length} of 56 total Users
        </p> */}
      </div>
    </div>
  );
}
