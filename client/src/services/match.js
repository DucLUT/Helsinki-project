import { axiosInstance } from "../libs/axios";

// filepath: /home/minhduc/Documents/work/helsinki-project/client/src/services/match.js
export const getMatches = async () => {
    const res = await axiosInstance.get(`/matches`);
    console.log("API Response:", res.data); // Log the response
    return res.data;
};