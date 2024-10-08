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

const rootReducer = combineReducers({
  user: userReducer,
  application: applicationReducer,
  company: companyReducer,
  job: jobReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "application", "company", "job"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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

export const persistor = persistStore(store);
