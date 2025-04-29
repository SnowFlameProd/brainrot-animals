import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:4000/api",
    timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
   const user = localStorage.getItem('user');
   if (user) {
       config.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
   }
   return config;
});

export default axiosInstance;