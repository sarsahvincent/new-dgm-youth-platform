import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId : localStorage.getItem("userId")
  ? JSON.parse(localStorage.getItem("userId"))
  : [],
  allUsers: localStorage.getItem("allUsers")
  ? JSON.parse(localStorage.getItem("allUsers"))
  : [],
  currentUser: localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser"))
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
    getCurrentUserId(state, action){
      state.userId =action.payload;
      localStorage.setItem("userId", JSON.stringify(state.userId));
    },
    
    getAllUsers(state, action){
      state.allUsers =action.payload;
      localStorage.setItem("allUsers", JSON.stringify(state.allUsers));
    }
    
  },
});

export const { getCurrentUser, getCurrentUserId, getAllUsers } = usersSlice.actions;
export default usersSlice.reducer;
