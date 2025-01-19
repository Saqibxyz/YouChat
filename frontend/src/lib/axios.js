import axios from "axios";
export const axiosInstance = new axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});
