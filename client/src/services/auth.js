import { axiosInstance } from "../libs/axios";

export const check = async () => {
    const res = await axiosInstance.get("/auth/me"); 
    console.log("check the auth", res.data);
    return res.data;
};

export const signup = async (data) => {
    const res = await axiosInstance.post("/auth/signup", data);
    return res.data;
}

export const login = async (data) => {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data;
}

export const logout = async () => {
    const res = await axiosInstance.post("/auth/logout");
    return res.data;
}