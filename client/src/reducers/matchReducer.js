import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getMatches, getUserProfiles, left, right } from "../services/match";
import { getSocket } from "../socket/socket";

const matchSlice = createSlice({
  name: "match",
  initialState: {
    matches: [],
    isLoadingMyMatches: false,
    isLoadingMyUserProfiles: false,
    userProfiles: [],
    info: null,
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
    },
    setInfo: (state, action) => {
      state.info = action.payload;
    },
  },
});

export const {
  setMatches,
  setIsLoadingMyMatches,
  setIsLoadingMyUserProfiles,
  setUserProfiles,
  setInfo,
} = matchSlice.actions;

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

      toast.error(
        error.response.data.message || "Failed to fetch user profiles"
      );
      dispatch(setIsLoadingMyUserProfiles(false));
    }
  };
};
export const swipeLeft = (user) => {
  return async (dispatch) => {
    try {
      const response = await left(user._id);
      console.log("Swipe Left Response:", response);
      dispatch(fetchMatches());
      dispatch(setInfo("passed"));
    } catch (error) {
      console.error("Error during swipeLeft:", error);
      toast.error(error.response.data.message || "Failed to swipe left");
    } finally {
      setTimeout(() => {
        dispatch(setInfo(null));
      }, 2000);
    }
  };
};

export const swipeRight = (user) => {
  return async (dispatch) => {
    try {
      const response = await right(user._id);
      dispatch(fetchMatches());
      dispatch(setInfo("liked"));
    } catch (error) {
      console.error("Error during swipeRight:", error);
      toast.error(error.response.data.message || "Failed to swipe right");
    } finally {
      setTimeout(() => {
        dispatch(setInfo(null));
      }, 2000);
    }
  };
};

export const listenToNewMatches = () => {
  return async (dispatch, getState) => {
    try {
      const socket = getSocket();
      socket.on("newMatch", (newMatch) => {
        const currentMatches = getState().match.matches;
        dispatch(setMatches([...currentMatches, newMatch]));
        toast.success("You have a new match!");
      });
    } catch (error) {
      console.error("Error during listenToNewMatches:", error);
    }
  };
};

export const unsubscribeToNewMatches = () => {
  return async (dispatch) => {
    try {
      const socket = getSocket();
      socket.off("newMatch");
    } catch (error) {
      console.error("Error during unsubscribeToNewMatches:", error);
    }
  };
};

export default matchSlice.reducer;
