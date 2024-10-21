import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userReducer from "@/redux/slices/user.slice";
import applicationReducer from "@/redux/slices/application.slice";
import companyReducer from "@/redux/slices/company.slice";
import jobReducer from "@/redux/slices/job.slice";
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

// Root reducer combining slices
const rootReducer = combineReducers({
  user: userReducer,
  application: applicationReducer,
  company: companyReducer,
  job: jobReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "application", "company", "job"],
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Function to check and refresh state
const checkAndRefreshState = () => {
  const now = new Date().getTime();
  const lastRefresh = localStorage.getItem("lastRefresh");

  // Check if 1 hour (3600000 ms) has passed
  if (lastRefresh && now - lastRefresh > 60 * 60 * 1000) {
    localStorage.removeItem("persist:root"); // Clear persisted state
    localStorage.setItem("lastRefresh", now); // Update last refresh timestamp
  } else if (!lastRefresh) {
    localStorage.setItem("lastRefresh", now); // Initialize on first run
  }
};

// Call the check function
checkAndRefreshState();

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a persistor
export const persistor = persistStore(store);
