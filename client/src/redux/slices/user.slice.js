import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUserApi,
  registerUserApi,
  logoutUserApi,
  getUserSearchHistoryApi,
  clearUserSearchHistoryApi,
  updateUserProfileApi,
} from "../actions/user.action";

// Thunk for user login
export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Thunk for user registration
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Thunk for user logout
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutUserApi();
      return response.data; // Make sure to return the response data
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Thunk for fetching user search history
export const getUserSearchHistory = createAsyncThunk(
  "searchHistory/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserSearchHistoryApi();
      return response.data.searchHistory;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch search history"
      );
    }
  }
);

// Thunk for clearing user search history
export const clearUserSearchHistory = createAsyncThunk(
  "searchHistory/clear",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clearUserSearchHistoryApi();
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to clear search history"
      );
    }
  }
);

// Thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  "profile/update",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await updateUserProfileApi(formData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to update profile"
      );
    }
  }
);

// Initial state for user
const initialState = {
  user: null,
  isAuthenticated: false,
  searchHistory: [],
  loading: false,
  error: null,
  message: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        // Store token in localStorage
        if (action?.payload?.token) {
          localStorage.setItem("token", action?.payload?.token);
          localStorage.setItem(
            "profile",
            action?.payload?.user?.profile?.profilePhoto?.url
          );
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;

        // Store token in localStorage
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem(
            "profile",
            action?.payload?.user?.profile?.profilePhoto?.url
          );
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null; // Set the user to null on successful logout
        localStorage.removeItem("token"); // Clear the token from localStorage
        localStorage.removeItem("profile"); // Clear the profile if stored
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch search history
      .addCase(getUserSearchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserSearchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.searchHistory = action.payload;
      })
      .addCase(getUserSearchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear search history
      .addCase(clearUserSearchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearUserSearchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.searchHistory = [];
        state.message = action.payload;
      })
      .addCase(clearUserSearchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "Profile updated successfully";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearErrors, clearMessage } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
