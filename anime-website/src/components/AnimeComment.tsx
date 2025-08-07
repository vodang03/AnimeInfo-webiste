"use client";

import { addComment, getComment } from "@/api/user";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface AnimeCommentProps {
  background: string;
  animeID: number;
}

export interface User {
  user_id: number;
  username: string;
  avatar_url: string;
}

export interface Comment {
  id: number;
  anime_id: number;
  content: string;
  created_at: Date;
  User: User; // Thông tin user liên quan
}

export default function AnimeComment({
  background,
  animeID,
}: AnimeCommentProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  const { user } = useUser();

  const handleAddComment = async () => {
    if (!user) {
      toast.warning("Bạn phải đăng nhập để thực hiện chức năng này!!!");
      return;
    }

    if (newComment.trim() === "") {
      return;
    }

    try {
      const res = await addComment(animeID, user.user.user_id, newComment);
      if (res.status === 201) {
        const newCommentObj: Comment = {
          id: res.data.comment.id,
          anime_id: animeID,
          content: newComment.trim(),
          created_at: new Date(),
          User: {
            user_id: user.user.user_id,
            username: user.user.username,
            avatar_url: user.user.avatar_url,
          },
        };

        setComments((prev) => [newCommentObj, ...prev]);
        setNewComment("");
      }
    } catch (err) {
      console.log("Lỗi khi thêm bình luận", err);
    }
  };

  // So sánh với ngày hiện tại
  const formatSmartDate = (rawDate: string | Date) => {
    const date = new Date(rawDate);
    const now = new Date();

    const isSameDay =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isSameDay) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  useEffect(() => {
    const getCommentAnime = async () => {
      try {
        const res = await getComment(animeID);
        setComments(res.comment);
      } catch (error) {
        console.log("Lỗi khi lấy bình luận: ", error);
      }
    };

    getCommentAnime();
  }, []);

  return (
    <div
      className={`relative mt-6 p-6 ${background} rounded-2xl shadow space-y-4`}
    >
      <h2 className="text-2xl font-bold text-indigo-800">💬 Bình luận</h2>

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddComment}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Gửi
        </button>
      </div>

      {/* Comment List */}
      <div className="space-y-4 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 px-1">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic text-sm text-center">
            Chưa có bình luận nào.
          </p>
        ) : (
          comments.map((comment, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start shadow-sm p-3 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <img
                  src={comment.User.avatar_url}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <span className="font-medium text-gray-800">
                  {comment.User.username}
                </span>

                <span className="text-xs text-gray-500">
                  {formatSmartDate(comment.created_at)}
                </span>
              </div>

              <div className="flex justify-between items-center ml-12">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
