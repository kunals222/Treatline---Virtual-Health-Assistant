// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appointmentReducer from './slices/appointmentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments : appointmentReducer,
  },
});

export default store;
