// src/screens/ProfileScreen.tsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../utils/colors';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

// Usa el tipo de props correcto para las tabs
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';
type Props = BottomTabScreenProps<RootTabParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí", onPress: () => logout() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfOHSguss6gP0JRsUrJyws0FG9jXzfOejFBtt1h4LwHP0CS4z8VYSvYyBqiehbdM9sJbQ&usqp=CAU' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{user?.displayName || 'Usuario'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* boton info de la app */}
        <TouchableOpacity style={styles.infoButton} onPress={() => navigation.navigate('About' as never)}>
          <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          <Text style={styles.infoButtonText}>Información de la Aplicación</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.grey} />
        </TouchableOpacity>

        <View style={styles.actionsContainer}>
          <CustomButton
            title="Cerrar Sesión"
            onPress={handleLogout}
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  contentContainer: { alignItems: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 16, borderWidth: 3, borderColor: colors.white },
  name: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  email: { fontSize: 16, color: colors.grey, marginTop: 4 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 30 },
  statBox: { alignItems: 'center', backgroundColor: colors.white, paddingVertical: 20, paddingHorizontal: 30, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: colors.primary },
  statLabel: { fontSize: 14, color: colors.grey, marginTop: 4 },
  infoButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, width: '100%', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 12, marginBottom: 20, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  infoButtonText: { flex: 1, fontSize: 16, color: colors.text, marginLeft: 15 },
  actionsContainer: { width: '100%', marginTop: 20 },
  logoutButton: { backgroundColor: colors.danger },
  logoutButtonText: { color: colors.white },
});
export default ProfileScreen;