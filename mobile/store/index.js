import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import inventoryReducer from './slices/inventorySlice';
import locationReducer from './slices/locationSlice';
import { useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    inventory: inventoryReducer,
    locations: locationReducer
  }
});

export default store;

// Export hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
