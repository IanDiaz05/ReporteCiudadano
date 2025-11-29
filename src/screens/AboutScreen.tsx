// src/screens/AboutScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';

const AboutScreen: React.FC = () => {
  const appVersion = '1.0.0'; // Puedes gestionar esto dinámicamente si lo necesitas en el futuro

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>ReporteCiudadano</Text>
        <Text style={styles.version}>Versión {appVersion}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enfoque de Desarrollo</Text>
          <Text style={styles.sectionContent}>
            Esta aplicación ha sido desarrollada utilizando un enfoque multiplataforma con React Native y Expo. A continuación, se detalla la justificación de esta elección.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>Diferencia: App Web vs. App Nativa</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>App Web:</Text> Se ejecuta dentro de un navegador web. Está construida con tecnologías como HTML, CSS y JavaScript. Es accesible a través de una URL y, aunque es multiplataforma por naturaleza, su rendimiento y acceso a las características del hardware del dispositivo (como la cámara, GPS o sensores) es más limitado.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>App Nativa:</Text> Es desarrollada específicamente para un sistema operativo (iOS con Swift/Objective-C o Android con Kotlin/Java). Se instala desde una tienda de aplicaciones (App Store, Google Play). Ofrece el mejor rendimiento, una experiencia de usuario optimizada para cada plataforma y acceso completo a todas las APIs y capacidades del dispositivo. Su principal desventaja es que requiere mantener dos bases de código separadas.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>Justificación del Uso de React Native (Híbrido/Multiplataforma)</Text>
          <Text style={styles.text}>
            Para "ReporteCiudadano", se eligió React Native por las siguientes razones clave:
          </Text>
          <Text style={styles.text}>
            • <Text style={styles.bold}>Única Base de Código:</Text> Permite escribir el código una sola vez en JavaScript/TypeScript y desplegarlo tanto en iOS como en Android. Esto reduce drásticamente el tiempo y los costos de desarrollo en comparación con mantener dos proyectos nativos separados.
          </Text>
          <Text style={styles.text}>
            • <Text style={styles.bold}>Rendimiento Casi Nativo:</Text> A diferencia de otros frameworks híbridos que corren en una vista web, React Native traduce los componentes de React a componentes de UI nativos. Esto resulta en un rendimiento fluido y una experiencia que se siente integrada en el sistema operativo.
          </Text>
          <Text style={styles.text}>
            • <Text style={styles.bold}>Acceso a Hardware:</Text> A través de Expo y módulos nativos, React Native facilita el acceso a funciones esenciales del dispositivo que son cruciales para nuestra app, como la cámara para tomar fotos de reportes, el GPS para la geolocalización y el acelerómetro para limpiar el formulario.
          </Text>
          <Text style={styles.text}>
            • <Text style={styles.bold}>Ecosistema Maduro:</Text> React Native cuenta con una comunidad enorme y un vasto ecosistema de librerías preexistentes, lo que acelera el desarrollo y facilita la resolución de problemas.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>Tecnologías Utilizadas</Text>
          <Text style={styles.text}>• Framework: React Native con Expo</Text>
          <Text style={styles.text}>• Lenguaje: TypeScript</Text>
          <Text style={styles.text}>• Backend: Firebase (Firestore, Authentication, Storage)</Text>
          <Text style={styles.text}>• Navegación: React Navigation</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: colors.grey,
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default AboutScreen;