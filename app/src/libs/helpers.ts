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

export function formatDate(date: string, forLastSeen?: boolean) {
    const dayjsDate = dayjs(parseInt(date, 10))
    const yesterday = dayjs().subtract(1, "d").startOf("day")

    // if its same day - return time
    if (dayjs().isSame(dayjsDate, "d")) {
        return forLastSeen ? `today at ${dayjsDate.format("hh:mm A")}` : dayjsDate.format("hh:mm A")
    }

    // if its yesterday - return 'Yesterday'
    if (dayjsDate.isSame(yesterday, "d")) {
        return forLastSeen ? `yesterday at ${dayjsDate.format("hh:mm A")}` : "Yesterday"
    }

    // else return full date
    return forLastSeen ? `on ${dayjsDate.format("DD MMM YYYY")}` : dayjsDate.format("DD/MM/YYYY")
}

function hexToHsl(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) {
        throw Error()
    }

    let r = parseInt(result[1], 16)
    let g = parseInt(result[2], 16)
    let b = parseInt(result[3], 16)

    r = r / 255
    g = g / 255
    b = b / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    let h,
        s,
        l = (max + min) / 2

    if (max === min) {
        h = s = 0 // achromatic
    } else {
        var d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h = (h || 0) / 6
    }

    s = Math.round(s * 100)
    l = Math.round(l * 100)
    h = Math.round(h * 360)

    return "hsl(" + h + ", " + s + "%, " + l + "%)"
}

export function darken(color: string, amt: number) {
    let hslColor = hexToHsl(color)

    const res = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslColor)
    if (!res) throw Error()

    // move light to 20s
    let [l] = res[3].split("")
    l = `${Math.max(0, parseInt(l, 10) + amt)}`

    return `hsl(${res[1]}, ${res[2]}%, ${l}%)`
}
