// src/components/MapCalloutCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Report } from '../types/models';
import { colors } from '../utils/colors';

interface MapCalloutCardProps {
  report: Report;
  onPress: () => void;
}

const MapCalloutCard: React.FC<MapCalloutCardProps> = ({ report, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.title}>{report.title}</Text>
      <View style={styles.footer}>
        <Text style={styles.category}>{report.category}</Text>
        <View style={[styles.statusBadge, { backgroundColor: report.urgent ? colors.warning : colors.grey }]}>
          <Text style={styles.statusText}>{report.urgent ? 'Urgente' : 'Normal'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 10,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MapCalloutCard;