import { axiosInstance } from "../libs/axios";

// filepath: /home/minhduc/Documents/work/helsinki-project/client/src/services/match.js
export const getMatches = async () => {
    const res = await axiosInstance.get(`/matches`);
    console.log("API Response:", res.data); // Log the response
    return res.data;
};

export const getUserProfiles = async () => {
    const res = await axiosInstance.get(`/matches/user-profiles`);
    console.log("API Response:", res.data); // Log the response
    return res.data;
}

export const left = async (userId) => {
    const res = await axiosInstance.post(`/matches/swipe-left/${userId}`);
    console.log("API Response in left:", res.data); // Log the response
    return res.data;
}

export const right = async (userId) => {
    const res = await axiosInstance.post(`/matches/swipe-right/${userId}`);
    console.log("API Response in right:", res.data); // Log the response
    return res.data;
}