import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast"
import { getMatches, getUserProfiles } from "../services/match";

const matchSlice = createSlice({
    name: "match",
    initialState: {
        matches: [],
        isLoadingMyMatches: false,
        isLoadingMyUserProfiles: false, 
        userProfiles: [],
    },
    reducers: {
        setMatches: (state, action) => {
            state.matches = action.payload;
        },
        setIsLoadingMyMatches: (state, action) => {
            state.isLoadingMyMatches = action.payload;
        },
        setIsLoadingMyUserProfiles: (state, action) => {
            state.isLoadingMyUserProfiles = action.payload;
        },
        setUserProfiles: (state, action) => {
            state.userProfiles = action.payload;
        }
    },
});

export const { setMatches, setIsLoadingMyMatches,  setIsLoadingMyUserProfiles, setUserProfiles} = matchSlice.actions;

export const fetchMatches = () => {
    return async (dispatch) => {
        dispatch(setIsLoadingMyMatches(true));
        try {
            const response = await getMatches();
            dispatch(setMatches(response.matches));
            dispatch(setIsLoadingMyMatches(false));
        } catch (error) {
            console.error("Error during fetchMatches:", error);
            
            toast.error(error.response.data.message || "Failed to fetch matches");
            dispatch(setIsLoadingMyMatches(false));
        }
    };
};

export const fetchUserProfiles = () => {
    return async (dispatch) => {
        dispatch(setIsLoadingMyUserProfiles(true));
        try {
            const response = await getUserProfiles();
            dispatch(setUserProfiles(response.users));
            dispatch(setIsLoadingMyUserProfiles(false));
        } catch (error) {
            console.error("Error during fetchUserProfiles:", error);
            
            toast.error(error.response.data.message || "Failed to fetch user profiles");
            dispatch(setIsLoadingMyUserProfiles(false));
        }
    };
};

export const swipeLeft = (user) => {
    
}
export default matchSlice.reducer;