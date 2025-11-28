// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../utils/colors';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

// Define los tipos para el navigator de autenticación
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = React.useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Error de inicio de sesión', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ReporteCiudadano</Text>
      <InputField
        label="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        placeholder="tu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <InputField
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholder="********"
        secureTextEntry
      />
      <CustomButton title="Iniciar Sesión" onPress={handleLogin} loading={loading} />
      <CustomButton
        title="¿No tienes cuenta? Regístrate"
        onPress={() => navigation.navigate('Register')}
        style={styles.secondaryButton}
        textStyle={styles.secondaryButtonText}
      />
    </View>
  );
};

// Añade `secureTextEntry` a las props de InputField
interface InputFieldProps {
  // ... otras props
  secureTextEntry?: boolean;
}

// Y en el componente TextInput:
// <TextInput secureTextEntry={secureTextEntry} ... />


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 40,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    marginTop: 15,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
});

export default LoginScreen;