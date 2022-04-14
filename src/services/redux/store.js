import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./reducers/userSlice";
import ActivitiesReducer from "./reducers/activitiesSlice";
import DepartmentSliceReducer from "./reducers/departmentSlice";

const store = configureStore({
  reducer: {
    users: UserReducer,
    activities: ActivitiesReducer,
    departments: DepartmentSliceReducer,
  },
});

export default store;
