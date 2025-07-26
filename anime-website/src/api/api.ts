// axios toàn cục (optional)

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  //   ✅ cho phép trình duyệt nhận cookie từ backend
  withCredentials: true, // ✅ mặc định gửi cookie trong mọi request
});

export default api;
