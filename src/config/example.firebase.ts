// renombra este archivo a 'firebase.ts' (sin "example.")
// coloca todas las credenciales de la consola de firebase

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase web
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);

// Inicializa y exporta Firestore
export const db = getFirestore(app);