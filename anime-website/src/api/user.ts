import axios from "axios";
import api from "./api";

interface User {
  username: string;
  email: string;
  phone_number: string;
  avatar_url: string;
}

export const fetchAllUser = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/user/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const fetchUserByID = async (id: number) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/user/${id}`, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUserByID = async (
  id: number,
  updatedData: Partial<User>
) => {
  console.log("Thông tin sẽ được cập nhật: ", updatedData);

  try {
    const response = await axios.put(
      `http://localhost:5000/api/user/${id}`,
      updatedData
    );
    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const checkUserLogin = async (
  emailOrUsername: string,
  password: string
) => {
  try {
    const res = await api.post(
      `http://localhost:5000/api/auth/login`,
      {
        emailOrUsername,
        password,
      },
      {
        withCredentials: true, // nếu có cookie login
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error login:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  return await axios.post(
    "http://localhost:5000/api/auth/logout",
    {},
    { withCredentials: true }
  );
};

export const fetchCurrentUser = async () => {
  const res = await api.get(`http://localhost:5000/api/auth/me`, {
    withCredentials: true, // nếu có cookie login
    headers: {
      "ngrok-skip-browser-warning": "69420",
    },
  });
  return res.data;
};

export const fetchAllAvatar = async () => {
  const res = await axios.get("http://localhost:5000/api/user/avatar");
  return res.data;
};

export const confirmUserGenre = async (user_id: number, genres: number[]) => {
  const res = await axios.post("http://localhost:5000/api/user/genre", {
    user_id,
    genres,
  });
  return res;
};

export const fetchGenreByUserID = async (id: number) => {
  const res = await axios.get(`http://localhost:5000/api/user/genre/${id}`);
  return res.data;
};

export const addComment = async (
  anime_id: number,
  user_id: number,
  comment: string
) => {
  const res = await axios.post("http://localhost:5000/api/user/comment", {
    anime_id,
    user_id,
    comment,
  });
  return res;
};

export const getComment = async (anime_id: number) => {
  const res = await axios.get("http://localhost:5000/api/user/comment", {
    params: { anime_id },
  });
  return res.data;
};

export const delAccount = async (user_id: number) => {
  const res = await axios.delete(`http://localhost:5000/api/user/${user_id}`);
  return res;
};
