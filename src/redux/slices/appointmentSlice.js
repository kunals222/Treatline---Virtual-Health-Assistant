// src/redux/slices/appointmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

export const fetchAppointments = createAsyncThunk('appointments/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/appointments');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Fetch available doctors based on symptoms, time slot, and language
export const fetchAvailableDoctors = createAsyncThunk('appointments/fetchAvailableDoctors', async (criteria, { rejectWithValue }) => {
  try {
    const response = await api.post('/doctors/predict', criteria);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchPatientAppointments = createAsyncThunk('appointments/fetchPatientAppointments', async (patientId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/appointments/user`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Book an appointment
export const bookAppointment = createAsyncThunk('appointments/bookAppointment', async (appointmentData, { rejectWithValue }) => {
  try {
    const response = await api.post('/appointments/book', appointmentData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Save prescription to the backend
export const savePrescription = createAsyncThunk(
  'appointments/savePrescription',
  async ({ appointmentId, medications, additionalInstructions }, { rejectWithValue }) => {
    try {
      console.log('Saving prescription:', { appointmentId, medications, additionalInstructions });
      const response = await api.put('/appointments/prescription', {
        appointmentId,
        medications,
        additionalInstructions,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to save prescription');
    }
  }
);

// Fetch appointment details including prescription
export const fetchAppointmentDetails = createAsyncThunk(
  'appointments/fetchAppointmentDetails',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/appointments/single/${appointmentId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch appointment details');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    availableDoctors: [],
    appointmentDetails: null, // New state for storing fetched appointment details
    priority_score: "gAAAAABn4bFcUWCq8sMXV5FA5A28uscv0gPyNS7l2xRz7TY6FHxWoy_idrXvIsp1dZwHOuJG7-cBBGbGg9MgTeqV1QMJdHYN2A==",
    loading: false,
    error: null,
    pastApt: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAvailableDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.availableDoctors = action.payload.doctors;
        state.priority_score = action.payload.priority_score;
      })
      .addCase(fetchAvailableDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle the savePrescription action
      .addCase(savePrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePrescription.fulfilled, (state, action) => {
        state.loading = false;
        // Handle successful save (e.g., show a success message)
      })
      .addCase(savePrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPatientAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.pastApt = action.payload.pastAppointments;
      })      
      .addCase(fetchPatientAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAppointmentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentDetails = action.payload; // Store fetched appointment details
      })
      .addCase(fetchAppointmentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default appointmentSlice.reducer;
