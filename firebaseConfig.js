// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBzwn-PmnNcCMdny2ysuZXGfqNek6rA3WY",
    authDomain: "gastosdv-3ed0b.firebaseapp.com",
    projectId: "gastosdv-3ed0b",
    storageBucket: "gastosdv-3ed0b.appspot.com",
    messagingSenderId: "695213874575",
    appId: "1:695213874575:web:9ab92db723eb609369fffa",
    measurementId: "G-PBNQVY0PTC"
  };
  
  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  