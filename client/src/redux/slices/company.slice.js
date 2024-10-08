import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerCompanyApi,
  getCompaniesApi,
  getCompanyByIdApi,
  updateCompanyApi,
} from "../actions/company.action";

// Thunk for registering a company
export const registerCompany = createAsyncThunk(
  "company/register",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await registerCompanyApi(companyData);
      return response.data; // Assuming the response contains the registered company data
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Thunk for fetching all companies of the logged-in user
export const getCompanies = createAsyncThunk(
  "company/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCompaniesApi();
      return response.data; // Assuming the response contains a list of companies
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Thunk for fetching a company by ID
export const getCompanyById = createAsyncThunk(
  "company/getById",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await getCompanyByIdApi(companyId);
      return response.data; // Assuming the response contains the company data
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Thunk for updating a company
export const updateCompany = createAsyncThunk(
  "company/update",
  async ({ companyId, companyData }, { rejectWithValue }) => {
    try {
      const response = await updateCompanyApi(companyId, companyData);
      return response.data; // Assuming the response contains the updated company data
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Initial state for the company slice
const initialState = {
  companies: [], // For listing all companies
  company: null, // For the selected company data
  loading: false, // For loading state across all actions
  error: null, // To capture any errors
  message: null, // For displaying messages
  success: false, // To indicate success of actions
};

// Create the slice
const companySlice = createSlice({
  name: "company",
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
      // Register Company
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.push(action.payload); // Append the newly registered company to the list
        state.success = true;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Companies
      .addCase(getCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.companies || []; // Assuming response has a "companies" field
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Company by ID
      .addCase(getCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company || null; // Assuming response has a "company" field
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Company
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company || null; // Update company details
        state.success = true;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearErrors, clearMessage } = companySlice.actions;

// Export reducer
export default companySlice.reducer;
