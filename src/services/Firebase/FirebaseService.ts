import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Import the functions you need from the SDKs you need
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// CONST SHOULD BE EMPTY IN REPO !!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const firebaseConfig = {
    apiKey: "AIzaSyCNmCxdgSP2oSPezF-_yJEgX-W14nIUpyY",
    authDomain: "traffic1-b5605.firebaseapp.com",
    projectId: "traffic1-b5605",
    storageBucket: "traffic1-b5605.appspot.com",
    messagingSenderId: "889555300440",
    appId: "1:889555300440:web:2bcbfec0d1940f9dbf5a2d"
};

export const EMAIL_COND_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const USERS_TYPS = {
    ADM: {value: 'Administrador', code: 'ADM'}, 
    CLI: {value: 'Conductor', code: 'CON'}, 
    ABO: {value: 'Controlador', code: 'CTR'}, 
    ALL: {value: 'Publico', code: 'ALL'}
};
// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDatabase = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);