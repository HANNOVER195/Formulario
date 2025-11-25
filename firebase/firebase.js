// ~/firebase/firebase.js

import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// 🔑 Importar el módulo de Autenticación
import { getAuth } from "firebase/auth" 

// Configuración de Firebase (Tus credenciales)
const firebaseConfig = {
  apiKey: "AIzaSyCyuvVV7EHgSxFgUiI4p4wGuzQ-dYOGabE",
  authDomain: "prac-form-21f1f.firebaseapp.com",
  projectId: "prac-form-21f1f",
  storageBucket: "prac-form-21f1f.firebasestorage.app",
  messagingSenderId: "589176319025",
  appId: "1:589176319025:web:81ef061164544be0fef910",
  measurementId: "G-9FMEH1SXXG"
}

// Verifica si ya hay apps inicializadas (es la práctica recomendada en Nuxt/SSR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Obtiene la instancia de la base de datos Firestore
const db = getFirestore(app)

// 🔑 Obtiene la instancia de Authentication (es la que usaremos para el login)
const auth = getAuth(app) 

// Exportamos ambas instancias
export { db, auth }