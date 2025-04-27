import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast"
import { check, signup, logout, login } from "../services/auth";
import { initializeSocket } from "../socket/socket";

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
    return async (dispatch) => {
        try {
            const res = await check(); 
            dispatch(setAuthUser(res)); 
            initializeSocket(res.data.user._id);
        } catch (error) {
            console.error("Error during checkAuth:", error);
            dispatch(clearAuthUser()); 
        }
    };
};

export const signupUser = (data) => {
    return async (dispatch) => {
        try {
            const res = await signup(data); 
            toast.success("Sign up successfully");
            dispatch(setAuthUser(res)); 
            initializeSocket(res.data.user._id);
        } catch (error) {
            console.error("Error during signup:", error);
            const errorMessage = error.response?.data?.message || "An error occurred during signup";
            toast.error(errorMessage);
        }
    };
};

export const loginUser = (data) => {
    return async (dispatch) => {
        try {
            const res = await login(data); 
            toast.success("Logged in successfully");
            dispatch(setAuthUser(res)); 
            initializeSocket(res.data.user._id);
        } catch (error) {
            console.error("Error during login:", error);
            const errorMessage = error.response?.data?.message || "An error occurred during login";
            toast.error(errorMessage);
        }
    };
};

export const logOut = () => {
    return async (dispatch) => {
        try {
            await logout(); 
            dispatch(clearAuthUser());
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Error during logout:", error);
            toast.error("An error occurred during logout");
        }
    };
}

export default authSlice.reducer
