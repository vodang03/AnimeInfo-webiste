"use client";

import { useEffect, useState } from "react";
import ChatMessage from "@/components/ChatMessage";
import MessageInput from "@/components/MessageInput";
import { createMessage, fetchMessages } from "@/api/discussion";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import { useUser } from "@/contexts/UserContext";

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`);

interface message {
  id: number;
  isSender: boolean;
  message: string;
  avatarUrl: string;
  roomId?: number;
  userId?: number;
}

export default function ChatPage() {
  const params = useParams(); // ✅ Hook gọi ở đây là đúng
  const id = params.id?.toString(); // Chuyển thành string nếu cần
  const roomId = parseInt(id || "0"); // roomId: number

  const { user } = useUser();

  const getCurrentUserId = () => {
    try {
      if (user) {
        return user.user.user_id;
      }
    } catch {
      return null;
    }
  };

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<message[]>([]);

  useEffect(() => {
    const userId = getCurrentUserId();

    // console.log(userId);
    console.log(roomId);

    if (!userId || !roomId) return;
    setCurrentUserId(userId);

    fetchMessages(roomId, userId).then(setMessages);

    // 👉 Tham gia phòng chat
    socket.emit("join_room", roomId);

    // 👉 Lắng nghe tin nhắn mới
    socket.on("receive_message", (msg: message) => {
      // Kiểm tra xác nhận người gửi
      const isSender = msg.userId === userId;

      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          isSender,
        },
      ]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [roomId, user]);

  const handleSend = async (text: string) => {
    if (!currentUserId) return;

    const result = await createMessage(roomId, currentUserId, text, "");

    const newMessage: message = {
      id: result.id,
      isSender: true,
      message: text,
      avatarUrl: "/avatar2.png",
      roomId,
      userId: currentUserId,
    };

    // 👉 Gửi qua socket
    socket.emit("send_message", newMessage);
  };

  console.log("Các tin nhắn trong phòng: ", messages);

  return (
    <div className="max-w-3xl mx-auto h-[100vh] bg-white relative flex flex-col -mb-36">
      <div className="flex-1 p-6 overflow-y-auto mb-[72px]">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 max-w-3xl mx-auto bg-white border-t border-gray-200 p-4">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
