// src/screens/MapScreen.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, onSnapshot } from 'firebase/firestore';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';
import MapCalloutCard from '../components/MapCalloutCard';
import { useNavigation } from '@react-navigation/native';
import InfoButton from '../components/InfoButton';
import InfoModal from '../components/InfoModal';

import { Report } from '../types/models';
import { colors } from '../utils/colors';
import { db } from '../config/firebase';

type Props = BottomTabScreenProps<RootTabParamList, 'Map'>;

const MapScreen: React.FC<Props> = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);

  // useEffect para obtener la ubicación del usuario
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // useEffect para obtener los reportes de Firestore en tiempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'reportes'), (querySnapshot) => {
      const reportsData: Report[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Aseguramos que los datos necesarios para el mapa existan
        if (data.latitude && data.longitude) {
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
          });
        }
      });
      setReports(reportsData);
    }, (error) => {
        console.error("Error fetching reports for map: ", error);
    });

    return () => unsubscribe();
  }, []);

  const handlePressReportCard = (report: Report) => {
    navigation.navigate('ReportDetails' as never, { report } as never);
  };

  const initialRegion = {
    latitude: location ? location.coords.latitude : 21.2003611, // Latitud unicaribe
    longitude: location ? location.coords.longitude : -86.82347222222222, // Longitud unicaribe
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MapView
          style={[styles.map, { paddingBottom: tabBarHeight }]}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton
        >
          {reports.map((report) => (
            <Marker
              key={report.id}
              coordinate={{ latitude: report.latitude, longitude: report.longitude }}
              pinColor={report.urgent ? colors.danger : colors.primary}
            >
              <Callout tooltip>
                <MapCalloutCard
                  report={report}
                  onPress={() => handlePressReportCard(report)}
                />
              </Callout>
            </Marker>
          ))}
        </MapView>
        <InfoButton onPress={() => setInfoModalVisible(true)} />
          <InfoModal 
          visible={isInfoModalVisible} 
          onClose={() => setInfoModalVisible(false)} 
        />
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
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height *0.94,
  },
  callout: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    width: 150,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutCategory: {
    color: colors.grey,
  },
});

export default MapScreen;