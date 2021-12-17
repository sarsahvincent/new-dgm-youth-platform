import { configureStore } from "@reduxjs/toolkit";
import UserReducer from './reducers/userSlice'

const store = configureStore({
  reducer: {
      users: UserReducer
  },
});

export default store;
