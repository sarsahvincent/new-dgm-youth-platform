import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: [],
  allUsers: localStorage.getItem("allUsers")
    ? JSON.parse(localStorage.getItem("allUsers"))
    : [],
  viewUserDetails: localStorage.getItem("viewUserDetails")
    ? JSON.parse(localStorage.getItem("viewUserDetails"))
    : [],
  currentUser: localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser"))
    : [],
  totalFemales: localStorage.getItem("totalFemales")
    ? JSON.parse(localStorage.getItem("totalFemales"))
    : [],
  profileDetails: localStorage.getItem("profileDetails")
    ? JSON.parse(localStorage.getItem("profileDetails"))
    : [],
  programContacts: localStorage.getItem("programContacts")
    ? JSON.parse(localStorage.getItem("programContacts"))
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
    getUserDetails(state, action) {
      state.profileDetails = action.payload;
      localStorage.setItem(
        "profileDetails",
        JSON.stringify(state.profileDetails)
      );
    },
    getUserViewUserDetails(state, action) {
      state.viewUserDetails = action.payload;
      localStorage.setItem(
        "profileDetails",
        JSON.stringify(state.profileDetails)
      );
    },
    getProgramContacts(state, action) {
      state.programContacts = action.payload;
      localStorage.setItem(
        "programContacts",
        JSON.stringify(state.programContacts)
      );
    },
  },
});

export const {
  getCurrentUser,
  getCurrentUserId,
  getAllUsers,
  gitAllMales,
  getUserDetails,
  getProgramContacts,
  getUserViewUserDetails,
} = usersSlice.actions;
export default usersSlice.reducer;
