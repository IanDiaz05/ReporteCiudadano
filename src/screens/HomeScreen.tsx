// src/screens/HomeScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';
import { db } from '../config/firebase';
import { Report } from '../types/models';
import { colors } from '../utils/colors';
import ReportCard from '../components/ReportCard';
import Loader from '../components/Loader';

type Props = BottomTabScreenProps<RootTabParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'reportes'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reportsData: Report[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reportsData.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          category: data.category,
          latitude: data.latitude,
          longitude: data.longitude,
          urgent: data.urgent,
          status: data.status,
          createdAt: data.createdAt?.toDate() || new Date(),
          imageUrl: data.imageUrl,
        });
      });
      setReports(reportsData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching reports: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePressReport = (report: Report) => {
    navigation.navigate('ReportDetails', { report });
  };

  const renderReport = useCallback(({ item }: { item: Report }) => (
    <TouchableOpacity onPress={() => handlePressReport(item)}>
      <ReportCard report={item} />
    </TouchableOpacity>
  ), []);

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList data={reports} renderItem={renderReport} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} />
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Form')}>
          <Ionicons name="add" size={32} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea:{
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default HomeScreen;