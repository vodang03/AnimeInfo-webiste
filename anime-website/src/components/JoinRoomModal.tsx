"use client";

interface JoinRoomModalProps {
  roomTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function JoinRoomModal({
  roomTitle,
  onClose,
  onConfirm,
}: JoinRoomModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Tham gia phòng</h2>
        <p>
          Bạn có chắc chắn muốn tham gia vào phòng {`"${roomTitle}"`} không?
        </p>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
}
