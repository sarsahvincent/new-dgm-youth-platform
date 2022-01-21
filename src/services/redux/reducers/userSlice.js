import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: localStorage.getItem("userId")
    ? JSON.parse(localStorage.getItem("userId"))
    : [],
  allUsers: localStorage.getItem("allUsers")
    ? JSON.parse(localStorage.getItem("allUsers"))
    : [],
  currentUser: localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser"))
    : [],
  totalFemales: localStorage.getItem("totalFemales")
    ? JSON.parse(localStorage.getItem("totalFemales"))
    : [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getCurrentUser(state, action) {
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
    },
    getCurrentUserId(state, action) {
      state.userId = action.payload;
      localStorage.setItem("userId", JSON.stringify(state.userId));
    },

    getAllUsers(state, action) {
      state.allUsers = action.payload;
      localStorage.setItem("allUsers", JSON.stringify(state.allUsers));
    },

    gitAllMales(state) {
      let totalFemales = [];
      const females = state.allUsers.filter((user) => user.sex === "female");
      totalFemales.push(females);
      localStorage.setItem("totalFemales", JSON.stringify(state.allUsers));
    },
  },
});

export const { getCurrentUser, getCurrentUserId, getAllUsers , gitAllMales} =
  usersSlice.actions;
export default usersSlice.reducer;
