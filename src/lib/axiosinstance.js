import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://youtube-clone-rcez.onrender.com",
});

export default axiosInstance;