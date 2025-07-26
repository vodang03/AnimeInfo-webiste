"use client";

import { useEffect, useState } from "react";
import { Trash2, Settings } from "lucide-react";
import { fetchAllUser } from "@/api/user";

interface UserInfo {
  user_id: number;
  username: string;
  email: string;
  role: string; // ví dụ: ["Admin", "User"]
  avatar_url?: string;
}

// const mockUsers: UserInfo[] = [
//   {
//     id: 1,
//     name: "Yeray Rosales",
//     email: "name@email.com",
//     roles: ["Manager", "Admin", "Auditor"],
//     loggedIn: false,
//     avatar: "https://i.pravatar.cc/40?img=1",
//   },
//   {
//     id: 2,
//     name: "Lennert Nijenbivank",
//     email: "name@email.com",
//     roles: ["Manager", "Admin"],
//     loggedIn: true,
//     avatar: "https://i.pravatar.cc/40?img=2",
//   },
//   {
//     id: 3,
//     name: "Tallah Cotton",
//     email: "name@email.com",
//     roles: ["Admin", "Auditor"],
//     loggedIn: true,
//     avatar: "https://i.pravatar.cc/40?img=3",
//   },
//   {
//     id: 4,
//     name: "Adaora Azubuike",
//     email: "name@email.com",
//     roles: ["Admin", "Auditor"],
//     loggedIn: false,
//     avatar: "https://i.pravatar.cc/40?img=4",
//   },
//   {
//     id: 5,
//     name: "Antonin Hafer",
//     email: "name@email.com",
//     roles: ["Manager"],
//     loggedIn: true,
//     avatar: "https://i.pravatar.cc/40?img=5",
//   },
// ];

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
                    <button className="flex items-center text-sm text-gray-700 hover:text-indigo-600 transition">
                      <Settings className="w-4 h-4 mr-1" />
                      Điều chỉnh thông tin
                    </button>
                    <button className="flex items-center text-sm text-red-600 hover:text-red-800 transition">
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
