// components/ConfirmDeleteModal.tsx
import React from "react";

export default function ConfirmDeleteModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Xác nhận xoá tài khoản
        </h2>
        <p className="mb-6 text-gray-700">
          Bạn có chắc chắn muốn xoá tài khoản? Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            Huỷ
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}
