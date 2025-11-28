// src/screens/LocationPickerScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../utils/colors';
import CustomButton from '../components/CustomButton';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationPicker'>;

const LocationPickerScreen: React.FC<Props> = ({ navigation, route }) => {
  const initialLocation = route.params?.location || { latitude: 19.4326, longitude: -99.1332 };
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const handleMapPress = (event: any) => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  const handleConfirmLocation = () => {
    // Al navegar hacia atrás, pasamos la ubicación seleccionada
    navigation.navigate('Form', { selectedLocation });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...selectedLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        <Marker coordinate={selectedLocation} />
      </MapView>
      <View style={styles.buttonContainer}>
        <CustomButton title="Confirmar Ubicación" onPress={handleConfirmLocation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
});

export default LocationPickerScreen;