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



// Book an appointment
export const bookAppointment = createAsyncThunk('appointments/bookAppointment', async (appointmentData, { rejectWithValue }) => {
  try {
    const response = await api.post('/appointments/book', appointmentData);

    // first window of the payment is started ......
    


    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    availableDoctors: [],
    priority_score : "gAAAAABn4bFcUWCq8sMXV5FA5A28uscv0gPyNS7l2xRz7TY6FHxWoy_idrXvIsp1dZwHOuJG7-cBBGbGg9MgTeqV1QMJdHYN2A==",
    loading: false,
    error: null,
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
        // Handle successful booking (e.g., show a success message)
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;
