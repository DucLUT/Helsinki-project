import { createSlice } from "@reduxjs/toolkit";
import { sendPracticeMessage } from "../services/ai";

const aiSlice = createSlice({
    name:"ai",
    initialState: {
        messages: [], // { sender: "user" | "bot", content: string }
        loading: true,
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        }
    }
})
export const { addMessage, setLoading, clearMessages } = aiSlice.actions;
export const sendMessage = (message) => {
    return async (dispatch) => {
        dispatch(addMessage({ sender: "user", content: message }));
        dispatch(setLoading(true));
        try {
            const response = await sendPracticeMessage(message);
            dispatch(addMessage({ sender: "bot", content: response.data }));
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            dispatch(setLoading(false));
        }
    }
}

export default aiSlice.reducer;