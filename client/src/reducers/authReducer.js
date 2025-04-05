import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast"
import { check } from "../services/auth";

const authSlice = createSlice({
    name:"auth",
    initialState: {
        authUser: null
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.authUser = action.payload;
        },
        clearAuthUser: (state) => {
            state.authUser = null;
        }
    }
})

export const { setAuthUser, clearAuthUser } = authSlice.actions;

export const checkAuth = () => {
    return async dispatch => {
        const res = await check();
    }
}
export default authSlice.reducer
