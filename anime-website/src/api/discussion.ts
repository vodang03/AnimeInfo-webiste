import axios from "axios";

export const fetchDiscussionRooms = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/getrooms`
  );
  return response.data;
};

export const createDiscussionRoom = async (
  userID: number,
  title: string,
  maxMember: number
) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/createroom`,
    {
      userID,
      title,
      maxMember,
    }
  );
  return response.data;
};

export const joinDiscussionRoom = async (user_id: number, room_id: number) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/joinroom`,
    {
      user_id,
      room_id,
    }
  );
  return response.data;
};

export const fetchRoomMembers = async (roomId: number) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/members/${roomId}`
  );
  return response.data;
};

export const fetchMessages = async (roomId: number, userId: number) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/messages/${roomId}`,
    { params: { userId: userId } }
  );
  return res.data;
};

export const createMessage = async (
  roomId: number,
  userId: number,
  message: string,
  fileurl: string
) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/postmessage/${roomId}`,
    {
      room_id: roomId,
      user_id: userId,
      message: message,
      file_url: fileurl,
    }
  );
  return res.data;
};
