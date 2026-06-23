import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  locations: [],
  selectedLocation: null,
  isLoading: false,
  error: null
};

const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.locations = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const locationActions = locationSlice.actions;
export default locationSlice.reducer;
