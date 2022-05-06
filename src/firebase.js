// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const app = firebase.initializeApp({
  apiKey: 'AIzaSyCLrUNhkrc0KNGKgJIDtjtj2ehcPwKddmE',
  authDomain: 'fakegram-react.firebaseapp.com',
  projectId: 'fakegram-react',
  storageBucket: 'fakegram-react.appspot.com',
  messagingSenderId: '593265836879',
  appId: '1:593265836879:web:c0bfaa445b0dd964b8fb3a'
});

const auth = app.auth();
const db = firebase.firestore();
export { db, auth};
