import { createSlice } from "@reduxjs/toolkit";
import { suggest } from "../services/ai";

const suggestSlice = createSlice({
  name: "suggest",
  initialState: {
    suggestion: null,
    loading: false,
  },
  reducers: {
    setSuggestion: (state, action) => {
      state.suggestion = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
export const { setSuggestion, setLoading } = suggestSlice.actions;
export const generateSuggestion = (data) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await suggest(data);
      const cleanedPickupLine = response.pickupLine.replace(/^"|"$/g, "");
      dispatch(setSuggestion(cleanedPickupLine));
    } catch (error) {
      console.error("Error generating suggestion:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export default suggestSlice.reducer;
