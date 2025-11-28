// App.tsx
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import Loader from './src/components/Loader';

const AppContent = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />; // O un componente de splash screen
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}