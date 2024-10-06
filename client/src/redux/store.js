import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userReducer from "@/redux/slices/user.slice";
import applicationReducer from "@/redux/slices/application.slice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Combine your reducers
const rootReducer = combineReducers({
  user: userReducer,
  application: applicationReducer,
});

// Redux persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Persist only the user slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true, // Ensures redux-thunk is included
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
