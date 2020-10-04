import Geolocation from "react-native-geolocation-service"
import dayjs from "dayjs"
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

export function formatDate(date: string) {
    const dayjsDate = dayjs(parseInt(date, 10))
    const yesterday = dayjsDate.subtract(1, "d").startOf("day")
    const aWeekOld = dayjsDate.subtract(7, "d").startOf("day")

    // if its same day - return time
    if (dayjs().isSame(dayjsDate, "d")) {
        return dayjsDate.format("hh:mm A")
    }

    // if its yesterday - return 'Yesterday'
    if (dayjsDate.isSame(yesterday, "d")) {
        return "Yesterday"
    }

    // if its same week - return 'day'
    if (dayjsDate.isBefore(aWeekOld)) {
        return dayjsDate.format("dddd")
    }

    // else return full date
    return dayjsDate.format("DD/MM/YYYY")
}
