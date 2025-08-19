"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessage from "@/components/ChatMessage";
import MessageInput from "@/components/MessageInput";
import { createMessage, fetchMessages } from "@/api/discussion";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/contexts/UserContext";

interface Message {
  id: number;
  isSender: boolean;
  message: string;
  username: string;
  avatarUrl: string;
  created_at: Date;
  roomId?: number;
  userId?: number;
}

export default function ChatBox({ roomId }: { roomId: number }) {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Socket init
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Khi socket và roomId đã sẵn sàng
  useEffect(() => {
    if (!socket || !user?.user?.user_id || !roomId) return;

    const userId = user.user.user_id;
    setCurrentUserId(userId);

    fetchMessages(roomId, userId).then(setMessages);

    socket.emit("join_room", roomId);

    socket.on("receive_message", (msg: Message) => {
      const isSender = msg.userId === userId;
      setMessages((prev) => [...prev, { ...msg, isSender }]);
    });

    socket.on("user_typing", (username: string) => {
      if (username !== user.user.username) {
        setTypingUser(username);
      }
    });

    socket.on("user_stop_typing", () => {
      setTypingUser(null);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, [socket, user, roomId]);

  const handleSend = async (text: string) => {
    if (!currentUserId || !socket) return;

    const result = await createMessage(roomId, currentUserId, text, "");

    const newMessage: Message = {
      id: result.id,
      isSender: true,
      message: text,
      username: user!.user.username,
      avatarUrl: user!.user.avatar_url,
      created_at: new Date(),
      roomId,
      userId: currentUserId,
    };

    socket.emit("send_message", newMessage);
  };

  const handleTyping = () => {
    if (!socket) return;
    socket.emit("typing", { roomId, username: user!.user.username });

    // sau 10s không nhập thì ngừng
    setTimeout(() => {
      socket.emit("stop_typing", { roomId });
    }, 10000);
  };

  return (
    <div className="h-full bg-white flex flex-col rounded-xl border">
      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 pb-10 overflow-y-auto"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}
      </div>

      <div className="border-t p-4">
        {typingUser && (
          <div className="text-sm text-gray-500 mb-2">
            {typingUser} đang nhập...
          </div>
        )}
        <MessageInput
          onSend={handleSend}
          onTyping={handleTyping}
          onStopTyping={() => socket?.emit("stop_typing", { roomId })}
        />
      </div>
    </div>
  );
}
