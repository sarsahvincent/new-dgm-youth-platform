import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./reducers/userSlice";
import ActivitiesReducer from "./reducers/activitiesSlice";

const store = configureStore({
  reducer: {
    users: UserReducer,
    activities: ActivitiesReducer,
  },
});

export default store;
