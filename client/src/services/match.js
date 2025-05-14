import { axiosInstance } from "../libs/axios";

// filepath: /home/minhduc/Documents/work/helsinki-project/client/src/services/match.js
export const getMatches = async () => {
  const res = await axiosInstance.get(`/matches`);
  return res.data;
};

export const getUserProfiles = async () => {
  const res = await axiosInstance.get(`/matches/user-profiles`);
  return res.data;
};

export const left = async (userId) => {
  const res = await axiosInstance.post(`/matches/swipe-left/${userId}`);
  return res.data;
};

export const right = async (userId) => {
  const res = await axiosInstance.post(`/matches/swipe-right/${userId}`);
  return res.data;
};
