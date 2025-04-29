import axiosInstance from "./axiosInstance.ts";
import routes from "../routes/routes.ts";

export const signupUser = async (username: string, password: string) => axiosInstance.post(routes.signup, {
    username,
    password,
});

export const loginUser = async (username: string, password: string) => axiosInstance.post(routes.login, {
    username,
    password,
});

export const getQuestions = async () => axiosInstance.get(routes.get_questions, {});

export const getMe = async () => axiosInstance.get(routes.me);