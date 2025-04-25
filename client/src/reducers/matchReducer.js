import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast"
import { getMatches } from "../services/match";

const matchSlice = createSlice({
    name: "match",
    initialState: {
        matches: [],
        loading: false
    },
    reducers: {
        setMatches: (state, action) => {
            state.matches = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
});

export const { setMatches, setLoading, setError } = matchSlice.actions;

export const fetchMatches = () => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await getMatches();
            dispatch(setMatches(response.matches));
            dispatch(setLoading(false));
        } catch (error) {
            console.error("Error during fetchMatches:", error);
            
            toast.error(error.response.data.message || "Failed to fetch matches");
            dispatch(setLoading(false));
        }
    };
};
export default matchSlice.reducer;