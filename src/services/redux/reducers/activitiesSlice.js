import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allActivities: localStorage.getItem("allActivities")
    ? JSON.parse(localStorage.getItem("allActivities"))
    : [],
};

const allActivitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    getAllActivities(state, action) {
      state.allActivities = action.payload;
      localStorage.setItem(
        "allActivities",
        JSON.stringify(state.allActivities)
      );
    },
  },
});

export const { getAllActivities } = allActivitiesSlice.actions;
export default allActivitiesSlice.reducer;

