// src/components/AvatarPickerModal.tsx

import React from "react";

interface AvatarPickerModalProps {
  avatarList: string[];
  onSelect: (url: string) => void;
  onClose: () => void;
}

const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  avatarList,
  onSelect,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Chọn ảnh đại diện
        </h2>
        <div className="grid grid-cols-4 gap-4 max-h-[300px] overflow-y-auto">
          {avatarList.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`avatar-${index}`}
              className="w-16 h-16 rounded-full object-cover object-top cursor-pointer hover:scale-105 transition"
              onClick={() => onSelect(url)}
            />
          ))}
        </div>
        <button
          className="mt-4 px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400 block mx-auto"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default AvatarPickerModal;
