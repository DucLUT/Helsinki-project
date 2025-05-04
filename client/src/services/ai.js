import { axiosInstance } from "../libs/axios";

export const sendPracticeMessage = async (message) => {
    const res = await axiosInstance.post("/ai/practice", message);
    return res.data.response;
}
