import { axiosInstance } from "../libs/axios";

export const send = async (data) => {
    const res = await axiosInstance.post("/send", data);
    return res.data;
}
export const conversation = async (userId) => {
    const res = await axiosInstance.get(`/conversation/${userId}`);
    return res.data;
}

