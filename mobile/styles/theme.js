import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#FF6B35',
  secondary: '#004E89',
  success: '#06A77D',
  warning: '#FFA500',
  danger: '#D32F2F',
  light: '#F5F5F5',
  dark: '#333333',
  gray: '#999999',
  white: '#FFFFFF',
  border: '#E0E0E0'
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  body: {
    fontSize: 16,
    fontWeight: '400'
  },
  small: {
    fontSize: 12,
    fontWeight: '400'
  }
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    marginVertical: spacing.sm
  }
});
