"use client";

import { useState } from "react";
import { parseUserInput, RequestParams } from "@/utils/parseUserInput";
import { callApiByType } from "@/utils/apiSelector";
import { Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { toast } from "react-toastify";
import VoiceInput from "./VoiceInput";

interface Recommendation {
  mal_id: number;
  title: string;
  genres: string;
  studios: string;
  year: number;
  score: number;
  image_url: string;
}

interface RecommendResponse {
  recommendations: Recommendation[];
  message: string;
}

interface ChatItem {
  userMessage: string;
  response: RecommendResponse;
  isTyping?: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();

  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);

  const handleFetch = async () => {
    const parsed: RequestParams | null = parseUserInput(userInput);

    if (!parsed) {
      setUserInput("");

      setChatHistory((prev) => [
        ...prev,
        {
          userMessage: userInput,
          response: {
            recommendations: [],
            message: "Không thể thực hiện yêu cầu của bạn.",
          },
        },
      ]);
      return;
    }

    const currentUserMessage = userInput;
    setUserInput("");

    // Thêm tin nhắn người dùng với phản hồi rỗng (loading)
    setChatHistory((prev) => [
      ...prev,
      {
        userMessage: currentUserMessage,
        response: { recommendations: [], message: "" },
      },
    ]);

    setIsLoading(true);

    setTimeout(async () => {
      try {
        const data = await callApiByType(parsed);

        setChatHistory((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (lastIndex >= 0) {
            updated[lastIndex] = {
              ...updated[lastIndex],
              response: data,
            };
          }
          return updated;
        });
      } catch (err) {
        console.error(err);
        {
          setChatHistory((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0) {
              updated[lastIndex] = {
                ...updated[lastIndex],
                response: {
                  recommendations: [],
                  message:
                    "Không tìm thấy kết quả phù hợp với yêu cầu của bạn.",
                },
              };
            }
            return updated;
          });
        }
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <>
      {/* Nút mở chat */}
      <button
        onClick={() => {
          if (user) {
            setIsOpen(!isOpen);
          } else {
            toast.warning("Hãy đăng nhập để sử dụng Trợ lý ảo");
          }
        }}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white rounded-full p-4 shadow-xl hover:bg-indigo-700 transition duration-300 z-50"
        aria-label="Open chat"
      >
        💬
      </button>

      {/* Khung chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 w-[420px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden border border-gray-200 z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-4 font-bold text-lg shadow">
            Trợ lý Anime - CiriAI
          </div>

          {/* Lịch sử chat */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat, chatIndex) => (
                <div key={chatIndex}>
                  {/* Tin nhắn người dùng */}
                  <div className="flex justify-end">
                    <div className="bg-indigo-100 text-black px-4 py-2 rounded-2xl max-w-[70%] shadow-sm">
                      {chat.userMessage}
                    </div>
                  </div>

                  {/* Gợi ý từ AI nếu có */}
                  {chat.response.recommendations.length > 0 &&
                    chat.response.recommendations.map((anime, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 mt-3 justify-start"
                      >
                        <img
                          src={anime.image_url}
                          alt={anime.title}
                          className="h-20 w-16 object-cover rounded-lg border"
                        />
                        <div className="bg-gray-100 px-3 py-2 rounded-2xl shadow max-w-[75%]">
                          <Link href={`/anime/${anime.mal_id}`}>
                            <p className="font-semibold text-sm text-gray-800">
                              {anime.title}
                            </p>
                          </Link>
                          <p className="text-xs text-gray-600">
                            Score: {anime.score}
                          </p>
                        </div>
                      </div>
                    ))}

                  {/* Hiển thị message nếu có */}
                  {chat.response.message && (
                    <p className="bg-gray-100 px-3 py-2 rounded-2xl shadow max-w-[75%]">
                      {chat.response.message}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center pt-40 text-base space-y-2">
                <p>
                  👋{" "}
                  <span className="font-semibold text-indigo-700">CiriAI</span>{" "}
                  luôn sẵn sàng hỗ trợ bạn!
                </p>
                <p className="text-sm">
                  Gõ nội dung bạn muốn tìm kiếm về anime nhé
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="relative flex">
              <VoiceInput onChange={setUserInput} />

              <input
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                placeholder="Nhập yêu cầu về anime..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFetch();
                }}
              />

              <button
                onClick={handleFetch}
                disabled={isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
