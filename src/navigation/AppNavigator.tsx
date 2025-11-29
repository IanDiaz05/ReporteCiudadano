// src/navigation/AppNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, RootTabParamList } from '../types/navigation';
import { colors } from '../utils/colors';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FormScreen from '../screens/FormScreen';
import LocationPickerScreen from '../screens/LocationPickerScreen';
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Home') { iconName = focused ? 'home' : 'home-outline'; }
          else if (route.name === 'Map') { iconName = focused ? 'map' : 'map-outline'; }
          else if (route.name === 'Profile') { iconName = focused ? 'person' : 'person-outline'; }
          else { iconName = 'ellipse-outline'; }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grey,
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.lightGrey },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Mapa' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="Form"
        component={FormScreen}
        options={{
          title: 'Nuevo Reporte',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
        }}
      />
      <Stack.Screen
        name="LocationPicker"
        component={LocationPickerScreen}
        options={{ title: 'Seleccionar Ubicación', headerShown: true }}
      />
      <Stack.Screen 
        name="ReportDetails" 
        component={ReportDetailsScreen} 
        options={{ headerShown: false }} // Usamos un header personalizado en la pantalla
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen} 
        options={{ title: 'Información de la App', headerStyle: { backgroundColor: colors.primary }, headerTintColor: colors.white }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;