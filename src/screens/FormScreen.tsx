// src/screens/FormScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, Alert, Switch, Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/native-stack';
import { db, app } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage'; // CAMBIO: Importar AsyncStorage
import { ReportCategory } from '../types/models';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '../utils/colors';
import { useShake } from '../hooks/useShake';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import RadioButton from '../components/RadioButton';

type Props = StackScreenProps<'Form'>;

const categories: ReportCategory[] = ['Alumbrado', 'Bache', 'Basura', 'Vialidad', 'Parques y Jardines', 'Ruido', 'Otro'];

const MapViewFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.lightGrey }]}>
    <Text style={{ color: colors.grey, textAlign: 'center' }}>
      La vista previa del mapa no está disponible en Expo Go.
      {'\n'}
      La ubicación se guardará correctamente.
    </Text>
    {children}
  </View>
);

const FormScreen: React.FC<Props> = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReportCategory>('Bache');
  const [urgent, setUrgent] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // CAMBIO: useEffect para cargar y guardar el estado del formulario con AsyncStorage
  useEffect(() => {
    // Cargar datos guardados al montar la pantalla
    const loadFormData = async () => {
      try {
        const savedTitle = await AsyncStorage.getItem('form_title');
        const savedDescription = await AsyncStorage.getItem('form_description');
        const savedCategory = await AsyncStorage.getItem('form_category') as ReportCategory;
        const savedUrgent = await AsyncStorage.getItem('form_urgent');
        const savedImage = await AsyncStorage.getItem('form_image');
        
        if (savedTitle !== null) setTitle(savedTitle);
        if (savedDescription !== null) setDescription(savedDescription);
        if (savedCategory !== null) setCategory(savedCategory);
        if (savedUrgent !== null) setUrgent(savedUrgent === 'true');
        if (savedImage !== null) setImage(savedImage);
      } catch (e) {
        console.error("Failed to load form data.", e);
      }
    };

    loadFormData();
  }, []);

  // Guardar datos cada vez que cambian
  useEffect(() => {
    AsyncStorage.setItem('form_title', title);
    AsyncStorage.setItem('form_description', description);
    AsyncStorage.setItem('form_category', category);
    AsyncStorage.setItem('form_urgent', urgent.toString());
    if(image) AsyncStorage.setItem('form_image', image);
  }, [title, description, category, urgent, image]);

  // useEffect para la ubicación
  useEffect(() => {
    // Si volvemos de LocationPicker con una ubicación, la usamos
    if (route.params?.selectedLocation) {
      setLocation(route.params.selectedLocation);
    } else if (!location) {
      // Si no hay ubicación, pedimos la actual
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let locationResult = await Location.getCurrentPositionAsync({});
          setLocation({ latitude: locationResult.coords.latitude, longitude: locationResult.coords.longitude });
        } else {
          Alert.alert('Permiso denegado', 'Necesitamos permiso de ubicación para reportar el incidente.');
        }
      })();
    }
  }, [route.params?.selectedLocation, location]);
  
  // CAMBIO: Función para obtener la ubicación actual
  const handleUseCurrentLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let locationResult = await Location.getCurrentPositionAsync({});
        setLocation({ latitude: locationResult.coords.latitude, longitude: locationResult.coords.longitude });
        Alert.alert('Ubicación actualizada', 'Se ha usado tu ubicación actual.');
      } else {
        Alert.alert('Permiso denegado', 'No se pudo obtener la ubicación.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = useCallback(async () => {
    setTitle('');
    setDescription('');
    setCategory('Bache');
    setUrgent(false);
    setImage(null);
    // CAMBIO: Limpiar también el AsyncStorage
    try {
        await AsyncStorage.multiRemove(['form_title', 'form_description', 'form_category', 'form_urgent', 'form_image']);
    } catch(e) {
        console.error("Failed to clear form data.", e);
    }
  }, []);

  useShake(clearForm);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title || !description || !location) {
      Alert.alert('Error', 'Por favor completa todos los campos y asegúrate de tener una ubicación.');
      return;
    }

    setLoading(true);
    let imageUrl = '';

    try {
      if (image) {
        const storage = getStorage(app);
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `reportes/${Date.now()}`);
        // CAMBIO: Añadir contentType a la subida
        await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'reportes'), {
        title,
        description,
        category,
        urgent,
        latitude: location.latitude,
        longitude: location.longitude,
        status: 'pendiente',
        imageUrl,
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      Alert.alert('Éxito', 'Reporte enviado correctamente.');
      clearForm(); // Limpiar el formulario y el AsyncStorage
      navigation.navigate('Main', { screen: 'Home' }); // Navegación explícita a Home
    } catch (error) {
      setLoading(false);
      console.error('Error saving report: ', error);
      Alert.alert('Error', 'No se pudo guardar el reporte. Revisa la consola para más detalles.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
      <InputField label="Título" value={title} onChangeText={setTitle} placeholder="Ej: Bache en la calle principal" />
      <InputField label="Descripción" value={description} onChangeText={setDescription} placeholder="Describe el incidente..." multiline numberOfLines={4} />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <RadioButton key={cat} label={cat} selected={category === cat} onPress={() => setCategory(cat)} />
        ))}
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>¿Es urgente?</Text>
        <Switch trackColor={{ false: colors.lightGrey, true: colors.primary }} thumbColor={colors.white} onValueChange={setUrgent} value={urgent} />
      </View>

      <Text style={styles.label}>Foto (Opcional)</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? <Image source={{ uri: image }} style={styles.previewImage} /> : <Text style={styles.imagePickerText}>Añadir Foto</Text>}
      </TouchableOpacity>

      <Text style={styles.label}>Ubicación</Text>
      {/* CAMBIO: Botón de "usar ubicación actual" ahora tiene función */}
      <CustomButton title="Usar mi ubicación actual" onPress={handleUseCurrentLocation} loading={loading} style={styles.locationButton} />
      <CustomButton title="Seleccionar en el mapa" onPress={() => navigation.navigate('LocationPicker', { location })} />
      
      {/* CAMBIO: Previsualización de la ubicación seleccionada */}
      {location && (
        <View style={styles.mapPreview}>
          <Text style={styles.previewLabel}>Ubicación Seleccionada:</Text>
          {MapView ? (
            <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            >
            <Marker coordinate={location} />
          </MapView>
          ) : (
            <MapViewFallback>
              {/* Aquí podrías poner un ícono de ubicación si quieres */}
              <Ionicons name="location" size={40} color={colors.primary} />
            </MapViewFallback>
          )}
        </View>
      )}

      <CustomButton title="Enviar Reporte" onPress={handleSave} loading={loading} style={styles.submitButton} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.background,},
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  label: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12, marginTop: 10 },
  categoryContainer: {backgroundColor: colors.background, borderRadius: 12, marginBottom: 16, padding: 20,},
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  switchLabel: { fontSize: 16, fontWeight: '600', color: colors.text },
  imagePicker: {width: '100%',height: 150, backgroundColor: colors.white, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.lightGrey, borderStyle: 'dashed',},
  previewImage: { width: '100%', height: '100%', borderRadius: 12 },
  imagePickerText: {color: colors.grey, fontSize: 16, marginTop: 8,},
  locationButton: { marginBottom: 10, backgroundColor: colors.grey, },
  mapPreview: { marginTop: 10, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.lightGrey },
  previewLabel: { fontSize: 14, color: colors.grey, marginBottom: 5, marginLeft: 5 },
  map: { width: '100%', height: 150 },
  submitButton: { marginTop:20,marginBottom:30 },
});

export default FormScreen;