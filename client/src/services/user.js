import { axiosInstance } from "../libs/axios";

export const updateUser = async (data) => {
    const res = await axiosInstance.put("/users/update", data);
    return res.data;
}
export const getUser = async (id) => {
    const res = await axiosInstance.get(`/user/${id}`);
    return res.data;
}