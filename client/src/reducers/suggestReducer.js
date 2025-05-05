import { createSlice } from "@reduxjs/toolkit";
import { suggest } from "../services/ai";

const suggestSlice = createSlice({
    name: "suggest",
    initialState: {
        suggestions: null,
        loading: false,
    },
    reducers: {
        setSuggestions: (state, action) => {
            state.suggestions = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
})
export const { setSuggestions, setLoading } = suggestSlice.actions;
export const generateSuggestion = (data) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await suggest(data);
            console.log('suggestion response', response)
            dispatch(setSuggestions(response.pickupLine));
        } catch (error) {
            console.error("Error generating suggestion:", error);
        } finally {
            dispatch(setLoading(false));
        }
    }
}

export default suggestSlice.reducer;