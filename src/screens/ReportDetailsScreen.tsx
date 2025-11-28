// src/screens/ReportDetailsScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker } from 'react-native-maps';
import { Report } from '../types/models';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../utils/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = StackScreenProps<RootStackParamList, 'ReportDetails'>;

const ReportDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { report } = route.params;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <View style={styles.container}>
      {/* Usamos un header personalizado para tener control total */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Reporte</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView style={styles.content}>
        {/* Comprobación robusta para evitar crashes si no hay imagen */}
        {report.imageUrl && report.imageUrl.trim() !== '' && (
          <Image source={{ uri: report.imageUrl }} style={styles.image} />
        )}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{report.title}</Text>
          <Text style={styles.category}>{report.category}</Text>
          <Text style={styles.date}>{formatDate(report.createdAt)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: report.urgent ? colors.warning : colors.grey }]}>
            <Text style={styles.statusText}>{report.urgent ? 'Urgente' : 'Normal'}</Text>
          </View>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{report.description}</Text>
          <Text style={styles.sectionTitle}>Ubicación</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{ latitude: report.latitude, longitude: report.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
            >
              <Marker coordinate={{ latitude: report.latitude, longitude: report.longitude }} />
            </MapView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.primary, paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20 },
  headerTitle: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1 },
  image: { width: '100%', height: 250 },
  detailsContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  category: { fontSize: 16, color: colors.primary, fontWeight: '500', marginBottom: 4 },
  date: { fontSize: 14, color: colors.grey, marginBottom: 12 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 20 },
  statusText: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 20, marginBottom: 8 },
  description: { fontSize: 16, color: colors.text, lineHeight: 24 },
  mapContainer: { width: '100%', height: 200, borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  map: { ...StyleSheet.absoluteFillObject },
});

export default ReportDetailsScreen;