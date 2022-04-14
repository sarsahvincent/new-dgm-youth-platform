import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allDepartment: localStorage.getItem("allDepartment")
    ? JSON.parse(localStorage.getItem("allDepartment"))
    : [],
  editDepartment: localStorage.getItem("editDepartment")
    ? JSON.parse(localStorage.getItem("editDepartment"))
    : null,
};

const allDepartment = createSlice({
  name: "allDepartment",
  initialState,
  reducers: {
    getDepartments(state, action) {
      state.allDepartment = action.payload;
      localStorage.setItem(
        "allDepartment",
        JSON.stringify(state.allDepartment)
      );
    },
  },
  getCureentEditDepartment(state, action) {
      state.editDepartment = action.payload;
      localStorage.setItem(
        "editDepartment",
        JSON.stringify(state.editDepartment)
      );
    },
  
});

export const { getDepartments, getCureentEditDepartment } = allDepartment.actions;
export default allDepartment.reducer;

