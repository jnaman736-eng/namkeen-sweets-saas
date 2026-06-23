import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './store';
import RootNavigator from './navigation/RootNavigator';
import { useAppDispatch } from './store';
import { authActions } from './store/slices/authSlice';
import { loadStoredToken } from './utils/storage';

function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      const token = await loadStoredToken();
      if (token) {
        dispatch(authActions.setToken(token));
      }
    };
    initializeApp();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <RootNavigator />
      <StatusBar barStyle="dark-content" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
