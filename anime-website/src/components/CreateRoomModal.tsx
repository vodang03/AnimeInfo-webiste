"use client";

import { useState } from "react";

interface CreateRoomModalProps {
  onClose: () => void;
  onCreate: (title: string, maxMember: number) => void;
}

export default function CreateRoomModal({
  onClose,
  onCreate,
}: CreateRoomModalProps) {
  const [title, setTitle] = useState("");
  const [maxMember, setMaxMember] = useState<number>(10);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Vui lòng nhập tên phòng.");
      return;
    }
    onCreate(title, maxMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-indigo-700">
          Tạo Phòng Thảo Luận
        </h2>

        {/* Tên phòng */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên phòng
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Nhập tên phòng thảo luận"
          />
        </div>

        {/* Số lượng thành viên */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng thành viên tối đa
          </label>
          <input
            type="number"
            min={1}
            value={maxMember}
            onChange={(e) => setMaxMember(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Nhập số lượng (tối đa)"
          />
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Tạo phòng
          </button>
        </div>
      </div>
    </div>
  );
}
