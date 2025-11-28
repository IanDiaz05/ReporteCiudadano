// src/components/ReportCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Report } from '../types/models';
import { colors } from '../utils/colors';

interface ReportCardProps {
  report: Report;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resuelto':
        return colors.success;
      case 'en-revision':
        return colors.warning;
      default:
        return colors.grey;
    }
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: report.imageUrl || 'https://via.placeholder.com/80' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{report.title}</Text>
        <Text style={styles.date}>{formatDate(report.createdAt)}</Text>
        <View style={styles.footer}>
          <Text style={styles.category}>{report.category}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
            <Text style={styles.statusText}>{report.status.replace('-', ' ')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: colors.lightGrey,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

export default ReportCard;