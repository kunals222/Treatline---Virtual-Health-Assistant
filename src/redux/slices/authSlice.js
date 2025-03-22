import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { setAuthToken } from '../api/api';

// Login user and save token
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/doctors/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(user));
    setAuthToken(token);
    return { token, user };
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Register user with file upload support
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {

    // console.log(userData);
    // console.log("registering user");
    const response = await api.post('/doctors/register', userData, {
      headers: {
        'Content-Type': 'multipart/form-data', // To handle file uploads
      },
    });

    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(user));
    setAuthToken(token);
    return { token, user };

    
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

    // console.log(response);

    const updatedUser = response.data;

    // Update localStorage to reflect changes
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    return updatedUser;

    // return userData;
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

//fetch doctor profile
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
    // console.log(timeSlot);
      const response = await api.put('/doctors/updateSchedule', {timeSlot});
      
      return response.data;
  } catch (err) {
      return rejectWithValue(err.response.data);
  }
});

export const fetchAppointments = createAsyncThunk('auth/fetchAppointments', async (_, { rejectWithValue }) => {
  try {

    console.log("fetching appointments");
    
    const response = await api.get('/doctors/appointments');
     
    return response.data;
  } catch (err) {
      return rejectWithValue(err.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('userInfo')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      setAuthToken(null);
      state.user = null;
      state.token = null;
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
      })
      .addCase(registerUser.rejected, (state, action) => {
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

      //fetch doctor profile 
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

      //update doctor schedule
      .addCase(updateDoctorSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorSchedule.fulfilled, (state, action) => {
          state.loading = false;
          state.user =  action.payload.doctor;
      })
      .addCase(updateDoctorSchedule.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
      })

      //update user profile
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

      //fetch appointments
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
      });

  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
