import * as firebase from "firebase/app"
import { FIREBASE_CONFIG, FIREBASE_PUBLIC_VAPID_KEY } from "./keys"
import "firebase/messaging"

// inititialize firebase
const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG)
const messaging = firebaseApp.messaging()

messaging.usePublicVapidKey(FIREBASE_PUBLIC_VAPID_KEY)

export { messaging }
