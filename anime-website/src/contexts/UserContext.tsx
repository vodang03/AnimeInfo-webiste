"use client";

// Dùng để chia sẻ thông tin user cho toàn bộ ứng dụng
import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser } from "@/api/user";

interface Genre {
  genre_id: number;
  name: string;
}

interface UserData {
  user: {
    user_id: number;
    username: string;
    email: string;
    avatar_url: string;
    bio: string;
    phone_number: string;
    role: string;
    birthDate: Date;
    Genres: Genre[];
  };
}

const UserContext = createContext<{
  user: UserData | null;
  setUser: (user: UserData | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetchCurrentUser();
        // console.log("User fetched trong context:", res);
        setUser(res);
      } catch (err) {
        setUser(null);
        console.log(err);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
