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
// import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@/contexts/UserContext";
import ChatBox from "@/components/ChatBox";

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
  const [selectedRoom, setSelectedRoom] = useState<Conversation | null>(null);

  const [allRooms, setAllRooms] = useState<Conversation[]>([]);

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

  // Xử lý khi ấn chọn phòng
  const handleClickConversation = async (conv: Conversation) => {
    const room = conv;

    console.log(room);

    if (!room) return;

    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      toast.warning("Bạn cần đăng nhập để tham gia phòng thảo luận!");
      return;
    }

    const isFull = room.maxMember === room.nowMember;

    // Kiểm tra có phải chủ phòng
    const isOwner = room.create_user_id === currentUserId;
    // Kiểm tra có phải thành viên
    const data = await fetchRoomMembers(room.id); // lấy tất cả id người dùng của phòng
    const ids = data.map((idmem: MemberFromAPI) => idmem.user_id);
    const hasJoined = ids.includes(currentUserId);

    if (isOwner || hasJoined) {
      setSelectedRoom(room); // ✅ set phòng được chọn
      setSelectedRoomId(room.id);
    } else {
      setSelectedRoomId(room.id);
      if (isFull) {
        toast.warning("Phòng đã đủ người. Bạn không thể tham gia");
        return;
      }
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
        const currentUserId = user?.user.user_id;

        const allRooms: DiscussionRoomFromAPI[] = await fetchDiscussionRooms();

        setAllRooms(
          allRooms.map((room) => ({
            id: room.id,
            create_user: room.User.username,
            create_user_id: room.create_user_id,
            title: room.title,
            maxMember: room.max_member,
            nowMember: room.now_member,
          }))
        );

        if (!currentUserId) return;

        const userRooms: Conversation[] = [];

        for (const room of allRooms) {
          const isOwner = room.create_user_id === currentUserId;

          if (isOwner) {
            userRooms.push({
              id: room.id,
              title: room.title,
              create_user_id: room.create_user_id,
              create_user: room.User.username,
              maxMember: room.max_member,
              nowMember: room.now_member,
            });
            continue; // bỏ qua kiểm tra thành viên nếu đã là chủ phòng
          }

          // kiểm tra thành viên
          const members: MemberFromAPI[] = await fetchRoomMembers(room.id);
          const memberIds = members.map((m) => m.user_id);

          if (memberIds.includes(currentUserId)) {
            userRooms.push({
              id: room.id,
              title: room.title,
              create_user_id: room.create_user_id,
              create_user: room.User.username,
              maxMember: room.max_member,
              nowMember: room.now_member,
            });
          }
        }

        setConversations(userRooms);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng:", error);
      }
    };

    fetchRooms();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar trái */}
      <div className="w-[300px] bg-white shadow-md border-r flex flex-col">
        <div
          className="p-4 border-b flex justify-between items-center hover:cursor-pointer"
          onClick={() => {
            setSelectedRoom(null);
            setSelectedRoomId(null);
          }}
        >
          <h2 className="text-lg font-bold">Khám phá tất cả phòng</h2>
        </div>

        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Phòng đã tham gia</h2>
          <button
            onClick={() => handleOpenCreateModal()}
            className="text-blue-600 hover:text-blue-800 transition"
            title="Tạo phòng"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleClickConversation(conv)}
              className={`cursor-pointer px-4 py-3 border-b hover:bg-blue-50 transition ${
                selectedRoomId === conv.id ? "bg-blue-100 font-semibold" : ""
              }`}
            >
              <div className="text-sm">{conv.title}</div>
              <div className="text-xs text-gray-500">
                👤 {conv.create_user} • 👥 {conv.nowMember}/{conv.maxMember}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nội dung phải */}
      <div className="flex-1 p-6">
        {selectedRoom ? (
          <>
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-1">{selectedRoom.title}</h1>
              <p className="text-sm text-gray-600">
                Người tạo: {selectedRoom.create_user} • Thành viên:{" "}
                {selectedRoom.nowMember}/{selectedRoom.maxMember}
              </p>
            </div>
            <div className="h-[85vh]">
              <ChatBox roomId={selectedRoom.id} />
            </div>
          </>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-4  ">Khám phá tất cả phòng</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allRooms.map((conv) => (
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
          </div>
        )}
      </div>

      {/* Modal tạo phòng */}
      {showModal && (
        <CreateRoomModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateRoom}
        />
      )}

      {/* Modal tham gia phòng */}
      {showJoinModal && selectedRoomId !== null && (
        <JoinRoomModal
          roomTitle={allRooms.find((c) => c.id === selectedRoomId)?.title || ""}
          onClose={() => setShowJoinModal(false)}
          onConfirm={handleConfirmJoin}
        />
      )}
    </div>
  );
}
