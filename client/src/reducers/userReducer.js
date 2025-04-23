import { createSlice } from "@reduxjs/toolkit";
import { updateUser } from "../services/user";
import toast from "react-hot-toast"
const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        }
    },
});
export const { setUser, clearUser } = userSlice.actions;

export const updateProfile = (data) => {
    return async (dispatch) => {
        try {
            const user = await updateUser(data);
            dispatch(setUser(user));
        } catch (error) {
            console.error("Error during updateProfile:", error);
            const errorMessage = error.response?.data?.message || "An error occurred during profile update";
            toast.error(errorMessage);
        }
    };
}

export default userSlice.reducer;