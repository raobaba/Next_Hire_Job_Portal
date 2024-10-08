import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postJobApi,
  getAllJobsApi,
  getAdminJobsApi,
  getJobByIdApi,
} from "../actions/job.action";

export const postJob = createAsyncThunk(
  "job/postJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await postJobApi(jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to post job");
    }
  }
);

// Thunk to get all jobs
export const getAllJobs = createAsyncThunk(
  "job/getAllJobs",
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await getAllJobsApi(searchParams);
      return response.data.jobs;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Failed to fetch jobs");
    }
  }
);

// Thunk to get admin jobs
export const getAdminJobs = createAsyncThunk(
  "job/getAdminJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAdminJobsApi();
      return response.data.jobs;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch admin jobs"
      );
    }
  }
);

// Thunk to get job by ID
export const getJobById = createAsyncThunk(
  "job/getJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await getJobByIdApi(jobId);
      return response.data.job;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || "Failed to fetch job by ID"
      );
    }
  }
);

// Initial state
const initialState = {
  jobs: [],
  adminJobs: [],
  job: null,
  loading: false,
  error: null,
  success: false,
};

// Job slice
const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Post job cases
      .addCase(postJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(postJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload.job); // Add newly posted job to jobs array
        state.success = true;
      })
      .addCase(postJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Get all jobs cases
      .addCase(getAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload; // Set jobs data
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get admin jobs cases
      .addCase(getAdminJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.adminJobs = action.payload; // Set admin jobs data
      })
      .addCase(getAdminJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get job by ID cases
      .addCase(getJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload; // Set job data
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearErrors, clearSuccess } = jobSlice.actions;
export default jobSlice.reducer;
