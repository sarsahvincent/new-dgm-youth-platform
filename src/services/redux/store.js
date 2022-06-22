import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import userReducer from "./slices/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import UserReducer from "./reducers/userSlice";
import ActivitiesReducer from "./reducers/activitiesSlice";
import DepartmentSliceReducer from "./reducers/departmentSlice";

const rootReducer = combineReducers({
  users: UserReducer,
  activities: ActivitiesReducer,
  departments: DepartmentSliceReducer,
});

// const store = configureStore({
//   reducer: {
//     users: UserReducer,
//     activities: ActivitiesReducer,
//     departments: DepartmentSliceReducer,
//   },
// });

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

// export default store;
