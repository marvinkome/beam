import firebase from "firebase/app"
import "firebase/messaging"

export async function setupPushNotification() {
    const messaging = firebase.messaging()

    try {
        // ask user for permission
        await messaging.requestPermission()

        // then get token
        const token = await messaging.getToken()

        return token
    } catch (err) {
        console.warn(err)
        return err
    }
}

export function setupNotificationListener(cb: (msg: any) => void) {
    const messaging = firebase.messaging()
    messaging.onMessage(cb)
}
