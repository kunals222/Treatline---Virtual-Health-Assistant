import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { setAuthToken } from '../api/api';

// Login user and save token
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const { email, password, role } = credentials;
    const endpoint = role === 'doctor' ? '/doctors/login' : '/patients/login';
    const response = await api.post(endpoint, { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(user));
    localStorage.setItem('role', role);
    setAuthToken(token);
    return { token, user, role };
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Register user with file upload support
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/doctors/register', userData, {
      headers: {
        'Content-Type': 'multipart/form-data', // To handle file uploads
      },
    });

    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(user));
    localStorage.setItem('role', 'doctor');
    setAuthToken(token);
    return { token, user };
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Register patient with file upload support
export const registerPatient = createAsyncThunk('auth/registerPatient', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/patients/register', userData);

    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(user));
    localStorage.setItem('role', 'patient');
    setAuthToken(token);
    return { token, user };
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Fetch patient details
export const fetchPatientDetails = createAsyncThunk('auth/fetchPatientDetails', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/patients/profile');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Update patient profile
export const updatePatientProfile = createAsyncThunk('auth/updatePatientProfile', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.put('/patients/updateProfile', userData);

    const updatedUser = response.data;

    // Update localStorage to reflect changes
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    return updatedUser;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Update user profile
export const updateUserProfile = createAsyncThunk('auth/updateUserProfile', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.put('/doctors/updateProfile', userData, {
      headers: {
        'Content-Type': 'multipart/form-data', // To handle file uploads if needed
      },
    });

    const updatedUser = response.data;

    // Update localStorage to reflect changes
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    return updatedUser;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Submit feedback
export const submitFeedback = createAsyncThunk('auth/submitFeedback', async (feedbackData, { rejectWithValue }) => {
  try {
    const response = await api.post('/doctors/feedback', feedbackData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Logout user
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setAuthToken(null);
    return true;
  } catch (err) {
    return rejectWithValue('Logout failed');
  }
});

// Fetch doctor profile
export const fetchDoctorProfile = createAsyncThunk('auth/fetchDoctorProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/doctors/profile');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const updateDoctorSchedule = createAsyncThunk('auth/updateDoctorSchedule', async (timeSlot, { rejectWithValue }) => {
  try {
    const response = await api.put('/doctors/updateSchedule', { timeSlot });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchAppointments = createAsyncThunk('auth/fetchAppointments', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/doctors/appointments');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchAllDoctors = createAsyncThunk('doctors/fetchAllDoctors', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/doctors/find'); // Fetch all doctors
    return response.data; // Return the list of doctors
  } catch (err) {
    return rejectWithValue(err.response.data); // Handle errors
  }
});

export const fetchSingleDoctor = createAsyncThunk(
  'doctors/fetchDoctor',
  async ({ doctorId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/doctors/fetchDoctorDetail', { doctorId });
      return response.data; // Return the doctor details
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch doctor details');
    }
  }
);

export const updateDoctorRating = createAsyncThunk(
  'doctors/updateDoctorRating',
  async ({ doctorId, userRating, feedback }, { rejectWithValue }) => {
    try {
      const response = await api.put('/doctors/updateRating', { doctorId, userRating, feedback });
      return response.data; // Return the updated doctor data or success message
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update doctor rating');
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  doctors : [],
  doctor : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = action.payload.user;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      setAuthToken(null);
      state.user = null;
      state.token = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = 'doctor';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register Patient
      .addCase(registerPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = 'patient';
      })
      .addCase(registerPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Patient Details
      .addCase(fetchPatientDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.appointment = action.payload.appointment;
      })
      .addCase(fetchPatientDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Patient Profile
      .addCase(updatePatientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.patient;
      })
      .addCase(updatePatientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit Feedback
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        // Handle successful feedback submission (e.g., show a success message)
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch doctor profile
      .addCase(fetchDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update doctor schedule
      .addCase(updateDoctorSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.doctor;
      })
      .addCase(updateDoctorSchedule.rejected, (state, action) => {
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
        state.user = action.payload.doctor;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAppointments = action.payload.upcomingAppointments;
        state.pastAppointments = action.payload.pastAppointments;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all doctors
      .addCase(fetchAllDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors;
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //fetch single doctor
      .addCase(fetchSingleDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctor = action.payload.doctor;
      })
      .addCase(fetchSingleDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Doctor Rating
      .addCase(updateDoctorRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorRating.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update the doctor data in the state if needed
      })
      .addCase(updateDoctorRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
