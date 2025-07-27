"use client";

import { useEffect, useState } from "react";
import CreateRoomModal from "@/components/CreateRoomModal";
import JoinRoomModal from "@/components/JoinRoomModal";
// import { checkLogin } from "@/utils/checkLogin";
import {
  createDiscussionRoom,
  fetchDiscussionRooms,
  fetchRoomMembers,
  joinDiscussionRoom,
} from "@/api/discussion";
import { PlusCircle } from "lucide-react"; // Cần icon pack lucide-react
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@/contexts/UserContext";

interface Conversation {
  id: number;
  title: string;
  create_user_id: number;
  create_user: string;
  maxMember: number;
  nowMember: number;
}

interface DiscussionRoomFromAPI {
  id: number;
  title: string;
  create_user_id: number;
  max_member: number;
  now_member: number;
  User: { username: string };
}

interface MemberFromAPI {
  id: number;
  user_id: number;
  discussion_room_id: number;
}

export default function DiscussionRoomList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const router = useRouter();

  const { user } = useUser();

  console.log("User ở thời điểm hiện tại: ", user);

  const getCurrentUserId = () => {
    try {
      if (user) {
        return user.user.user_id;
      }
    } catch {
      return null;
    }
  };

  // Xử lý khi ấn chọn phòng
  const handleClickConversation = async (conv: Conversation) => {
    const room = conv;
    if (!room) return;

    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      toast.warning("Bạn cần đăng nhập để tham gia phòng thảo luận!");
      return;
    }

    // Kiểm tra có phải chủ phòng
    const isOwner = room.create_user_id === currentUserId;
    // Kiểm tra có phải thành viên
    const data = await fetchRoomMembers(room.id); // lấy tất cả id người dùng của phòng
    const ids = data.map((idmem: MemberFromAPI) => idmem.user_id);
    const hasJoined = ids.includes(currentUserId);

    if (isOwner || hasJoined) {
      router.push(`/discussion/${room.id}`); // Chuyển thẳng vào phòng
    } else {
      setSelectedRoomId(room.id);
      setShowJoinModal(true);
    }
  };

  const handleCreateRoom = async (title: string, maxMember: number) => {
    try {
      const newRoom = await createDiscussionRoom(
        user!.user.user_id,
        title,
        maxMember
      );
      setConversations((prev) => [
        {
          id: newRoom.id,
          title: newRoom.title,
          create_user_id: newRoom.create_user_id,
          create_user: newRoom.User.username,
          maxMember: newRoom.max_member,
          nowMember: newRoom.now_member,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Lỗi thao tác:", error);
    }
  };

  const handleConfirmJoin = async () => {
    const currentUserId = getCurrentUserId();

    if (selectedRoomId !== null) {
      try {
        await joinDiscussionRoom(currentUserId!, selectedRoomId);
        // Cập nhật UI sau khi tham gia thành công
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedRoomId
              ? { ...conv, nowMember: conv.nowMember + 1 }
              : conv
          )
        );
        toast.success("Đã tham gia phòng thành công");
      } catch (err) {
        toast.error("Gặp lỗi khi tham gia phòng. Vui lòng thử lại sau!!!");
        console.error("Lỗi khi tham gia phòng:", err);
      }
    }

    setShowJoinModal(false);
    setSelectedRoomId(null);
  };

  const handleOpenCreateModal = () => {
    if (user) {
      setShowModal(true);
    } else {
      toast.warning("Bạn cần đăng nhập để tạo phòng thảo luận!");
      return;
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data: DiscussionRoomFromAPI[] = await fetchDiscussionRooms();
        setConversations(
          data.map((room) => ({
            id: room.id,
            create_user: room.User.username,
            create_user_id: room.create_user_id,
            title: room.title,
            maxMember: room.max_member,
            nowMember: room.now_member,
          }))
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 px-6 py-8 text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">💬 Phòng Thảo Luận</h1>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Tạo Phòng</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => handleClickConversation(conv)}
            className="cursor-pointer group p-5 rounded-2xl bg-white shadow-md hover:shadow-xl hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-semibold group-hover:text-blue-700">
                {conv.title}
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              👤 Người tạo:{" "}
              <span className="font-medium">{conv.create_user}</span>
            </p>
            <p className="text-sm text-gray-600">
              👥 Thành viên:{" "}
              <span className="font-medium">
                {conv.nowMember}/{conv.maxMember}
              </span>
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <CreateRoomModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateRoom}
        />
      )}

      {showJoinModal && selectedRoomId !== null && (
        <JoinRoomModal
          roomTitle={
            conversations.find((c) => c.id === selectedRoomId)?.title || ""
          }
          onClose={() => setShowJoinModal(false)}
          onConfirm={handleConfirmJoin}
        />
      )}
    </div>
  );
}
