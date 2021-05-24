import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBaAP8SbMpXFPkmB6nWJI2N-xhEv3qpVak',
  authDomain: 'sticky-thoughts.firebaseapp.com',
  projectId: 'sticky-thoughts',
  storageBucket: 'sticky-thoughts.appspot.com',
  messagingSenderId: '614181703561',
  appId: '1:614181703561:web:090e3b5bd723ebbf3a5b58',
  measurementId: 'G-8FKWB19RJE',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

// Collections
const billingCollection = db.collection('billing')
const journalsCollection = db.collection('journals')
const paymentsCollection = db.collection('payments')
const themesCollection = db.collection('themes')
const usersCollection = db.collection('users')

// Exports
export {
  auth,
  db,
  firebase,
  storage,
  billingCollection,
  journalsCollection,
  paymentsCollection,
  themesCollection,
  usersCollection,
}
