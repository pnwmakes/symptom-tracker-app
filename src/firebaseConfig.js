// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyDtcShup5Zt0N1gn5BnyF7jf6i0tC5070g',
    authDomain: 'symptomtrackerapp-3fa5b.firebaseapp.com',
    projectId: 'symptomtrackerapp-3fa5b',
    storageBucket: 'symptomtrackerapp-3fa5b.appspot.com',
    messagingSenderId: '1044670168246',
    appId: '1:1044670168246:web:79676badb9555cefee57',
    measurementId: 'G-89X1WIVBZK',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
