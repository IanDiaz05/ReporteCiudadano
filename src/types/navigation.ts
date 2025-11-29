// src/types/navigation.ts

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Report } from './models';

// Define los parámetros para cada pantalla en el Stack Navigator
export type RootStackParamList = {
  Main: NavigatorScreenParams<RootTabParamList>;
  Form: { report?: Report };
  LocationPicker: { location?: { latitude: number; longitude: number } };
  ReportDetails: { report: Report };
  About: undefined;
};

// Define los parámetros para cada pantalla en el Tab Navigator
export type RootTabParamList = {
  Home: undefined;
  Map: undefined;
  Profile: undefined;
};

// Tipos de ayuda para las props de pantalla
export type TabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<
  RootTabParamList,
  T
>;

export type StackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;