import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  applyJobApi,
  getAppliedJobsApi,
  getApplicantsApi,
  updateApplicationStatusApi,
} from "../actions/application.action";

// Thunk to apply for a job
export const applyJob = createAsyncThunk(
  "application/apply",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await applyJobApi(jobId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to apply for job"
      );
    }
  }
);

// Thunk to get applied jobs
export const getAppliedJobs = createAsyncThunk(
  "application/getAppliedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAppliedJobsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch applied jobs"
      );
    }
  }
);

// Thunk to get applicants for a specific job
export const getApplicants = createAsyncThunk(
  "application/getApplicants",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await getApplicantsApi(jobId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch applicants"
      );
    }
  }
);

// Thunk to update application status
export const updateApplicationStatus = createAsyncThunk(
  "application/updateStatus",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const response = await updateApplicationStatusApi(applicationId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to update application status"
      );
    }
  }
);

// Initial state for application
const initialState = {
  applications: [],
  applicants: [],
  loading: false,
  error: null,
  success: null,
  message: null,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply job cases
      .addCase(applyJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.loading = false;
        console.log(action.payload)
        state.error = action.payload;
      })

      // Get applied jobs cases
      .addCase(getAppliedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppliedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(getAppliedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get applicants for a job cases
      .addCase(getApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload;
      })
      .addCase(getApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update application status cases
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearErrors, clearMessages } = applicationSlice.actions;

// Export reducer
export default applicationSlice.reducer;
