import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../utils/api-handler";

// Async thunk to fetch patients
export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get("patients/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const patientSlice = createSlice({
  name: "patients",
  initialState: {
    patients: [],
    loading: false,
    error: null,
  },
  reducers: {
    // New reducer to add a patient immediately to state
    addPatient: (state, action) => {
      state.patients.push(action.payload);
    },
    // Optional: clear patients if needed
    clearPatients: (state) => {
      state.patients = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the new action
export const { addPatient, clearPatients } = patientSlice.actions;

export default patientSlice.reducer;
