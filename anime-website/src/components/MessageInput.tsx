"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";

export default function MessageInput({
  onSend,
}: {
  onSend: (message: string, file?: File) => void;
}) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() && !file) return;
    onSend(message.trim(), file ?? undefined);
    setMessage("");
    setFile(null);
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t bg-white shadow-sm">
      {/* <button
        onClick={() => fileInputRef.current?.click()}
        className="text-gray-500 hover:text-indigo-600"
      >
        <Paperclip size={20} />
      </button> */}

      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setFile(f);
        }}
      />

      <input
        type="text"
        placeholder="Nhập tin nhắn..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={handleSend}
        className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
