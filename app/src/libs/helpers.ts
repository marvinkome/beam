import Geolocation from "react-native-geolocation-service"
import { PermissionsAndroid } from "react-native"

export async function getGeolocation() {
    const hasLocationAccess = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )

    const promise = (
        resolve: (location: { lat: number; long: number }) => void,
        reject: (reason?: Geolocation.GeoError) => void
    ) => {
        const onSuccess = (position: Geolocation.GeoPosition) => {
            resolve({
                lat: position.coords.latitude,
                long: position.coords.longitude,
            })
        }

        const onError = (error: Geolocation.GeoError) => {
            reject(error)
        }

        if (hasLocationAccess === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true })
        } else {
            reject({ code: 1, message: "Location permission not granted." })
        }
    }

    return new Promise(promise)
}
