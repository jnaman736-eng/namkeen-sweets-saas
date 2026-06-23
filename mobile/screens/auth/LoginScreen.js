import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { useAppDispatch } from '../../store';
import { authAPI } from '../../api/endpoints';
import { authActions } from '../../store/slices/authSlice';
import { Button, Input } from '../../components/common';
import { colors, spacing, typography } from '../../styles/theme';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      
      dispatch(authActions.setToken(token));
      dispatch(authActions.setUser(user));
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Namkeen & Sweets</Text>
        <Text style={styles.subtitle}>Manufacturing Management</Text>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title={loading ? 'Logging in...' : 'Login'}
          onPress={handleLogin}
          disabled={loading}
        />

        <Text style={styles.link}>
          Don't have an account? <Text onPress={() => navigation.navigate('Register')}>Sign Up</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.xl
  },
  link: {
    textAlign: 'center',
    marginTop: spacing.lg,
    color: colors.gray
  }
});

export default LoginScreen;
