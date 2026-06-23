import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store';
import LoginScreen from '../screens/auth/LoginScreen';
import OrderListScreen from '../screens/orders/OrderListScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const token = useAppSelector((state) => state.auth.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="Orders" component={OrderListScreen} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
