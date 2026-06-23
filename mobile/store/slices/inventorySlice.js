import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isLoading: false,
  error: null
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventory: (state, action) => {
      state.items = action.payload;
    },
    updateInventoryItem: (state, action) => {
      const index = state.items.findIndex(i => i._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const inventoryActions = inventorySlice.actions;
export default inventorySlice.reducer;
