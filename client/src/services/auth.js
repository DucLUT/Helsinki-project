import { axiosInstance } from "../libs/axios";

export const check = async () => {
    const res = await axiosInstance.get("/auth/me"); 
    console.log("check the auth", res.data);
    return res.data;
};