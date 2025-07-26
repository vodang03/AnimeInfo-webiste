"use client";

import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function MessageInput({
  onSend,
}: {
  onSend: (message: string) => void;
}) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex items-center border-t p-3">
      <input
        type="text"
        placeholder="Write your message ..."
        className="flex-grow p-2 rounded-lg border border-gray-300"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full"
        onClick={handleSend}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
}
