import { getSocket } from "../socket/socket";
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {message, conversation} from "../services/message";


const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: [],
        loading: true,
    },
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});
export const { setMessages, setLoading } = messageSlice.actions;

export const fetchMessages = (userId) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const res = await conversation(userId);
            dispatch(setMessages(res));
            dispatch(setLoading(false));
        } catch (error) {
            console.error("Error during fetchMessages:", error);
            toast.error(error.response.data.message || "Failed to fetch messages");
            dispatch(setLoading(false));
        }
}}

export default messageSlice.reducer;