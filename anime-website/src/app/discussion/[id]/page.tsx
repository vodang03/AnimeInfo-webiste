"use client";

import { useEffect, useState } from "react";
import ChatMessage from "@/components/ChatMessage";
import MessageInput from "@/components/MessageInput";
import { createMessage, fetchMessages } from "@/api/discussion";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/contexts/UserContext";

interface message {
  id: number;
  isSender: boolean;
  message: string;
  avatarUrl: string;
  roomId?: number;
  userId?: number;
}

export default function ChatPage() {
  const params = useParams();
  const id = params.id?.toString();
  const roomId = parseInt(id || "0");

  const { user } = useUser();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<message[]>([]);

  // 🔌 Khởi tạo socket chỉ 1 lần
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // 🔁 Lắng nghe khi socket, user, roomId sẵn sàng
  useEffect(() => {
    if (!socket || !user?.user?.user_id || !roomId) return;

    const userId = user.user.user_id;
    setCurrentUserId(userId);

    fetchMessages(roomId, userId).then(setMessages);

    socket.emit("join_room", roomId);

    socket.on("receive_message", (msg: message) => {
      const isSender = msg.userId === userId;
      setMessages((prev) => [...prev, { ...msg, isSender }]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, user, roomId]);

  const handleSend = async (text: string) => {
    if (!currentUserId || !socket) return;

    const result = await createMessage(roomId, currentUserId, text, "");

    const newMessage: message = {
      id: result.id,
      isSender: true,
      message: text,
      avatarUrl: "/avatar2.png",
      roomId,
      userId: currentUserId,
    };

    socket.emit("send_message", newMessage);
  };

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
