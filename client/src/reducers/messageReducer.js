import { getSocket } from "../socket/socket";
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { send, conversation } from "../services/message";

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
      dispatch(setMessages(res.messages));
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error during fetchMessages:", error);
      toast.error(error.response.data.message || "Failed to fetch messages");
      dispatch(setLoading(false));
    }
  };
};

export const sendMessage = (receiverId, content) => {
  return async (dispatch, getState) => {
    try {
      const currentMessages = getState().message.messages;
      const senderId = getState().auth.authUser.user._id; // Correct path to sender ID

      const newMessage = {
        sender: { _id: senderId },
        receiverId,
        content,
        createdAt: new Date().toISOString(),
      };

      dispatch(setMessages([...currentMessages, newMessage]));

      const res = await send({ receiverId, content });
    } catch (error) {
      console.error("Error during sendMessage:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to send message";
      toast.error(errorMessage);
    }
  };
};

export const listenToMessages = () => {
  return (dispatch, getState) => {
    const socket = getSocket();

    socket.on("newMessage", (payload) => {
      const currentMessages = getState().message.messages;

      // Assuming payload.message is a single message object
      dispatch(setMessages([...currentMessages, payload.message]));
    });
  };
};
export const unsubscribeToMessages = () => {
  return () => {
    try {
      const socket = getSocket();
      socket.off("newMessage");
    } catch (err) {
      console.warn("unsubscribeToMessages skipped:", err.message);
    }
  };
};

// export const unsubscribeToMessages = () => {
//   return (dispatch) => {
//     const socket = getSocket();

//     socket.off("newMessage");
//   };
// };

export default messageSlice.reducer;
