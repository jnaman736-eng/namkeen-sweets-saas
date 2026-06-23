import { createSlice } from '@reduxjs/toolkit';
import { saveStoredToken, clearStoredToken } from '../../utils/storage';

const initialState = {
  token: null,
  user: null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      saveStoredToken(action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      clearStoredToken();
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
