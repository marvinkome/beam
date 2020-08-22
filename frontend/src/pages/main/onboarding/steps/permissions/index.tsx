import React, { useEffect, useState, useCallback } from "react"
import OneSignal from "react-onesignal"
import { useMutation, gql } from "@apollo/client"
import { trackPageView, trackUserEvent, trackError } from "lib/GA"
import "./style.scss"

function getGeolocation() {
    return new Promise((res: (location: any) => void, rej) => {
        if (navigator.geolocation) {
            return navigator.geolocation.getCurrentPosition(
                (position) => {
                    res({
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                    })
                },
                () => {
                    rej()
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 30000,
                    timeout: 27000,
                }
            )
        } else {
            rej()
        }
    })
}

function useUserLocation() {
    const [locationError, setLocationError] = useState(false)
    const [hasLocation, setHasLocation] = useState(false)

    const [setLocation] = useMutation(gql`
        mutation SetLocation($location: LocationInput) {
            setLocation(location: $location)
        }
    `)

    useEffect(() => {
        getGeolocation()
            .then(async (location) => {
                setHasLocation(true)
                await setLocation({ variables: { location } })
            })
            .catch(() => {
                setLocationError(true)
            })
    }, [setLocation])

    const askForUserLocation = async () => {
        trackUserEvent("Ask for user location", "onboarding")

        const res = await navigator.permissions.query({ name: "geolocation" })

        if (res.state === "prompt" || res.state === "granted") {
            const location = await getGeolocation()
            setHasLocation(true)
            await setLocation({ variables: { location } })
            setLocationError(false)
        }
    }

    return {
        locationError,
        askForUserLocation,
        hasLocation,
    }
}

function useNotificationAccess(hasLocation: boolean, changeStep: () => void) {
    const requestPermission = useCallback(async () => {
        try {
            await OneSignal.registerForPushNotifications()
            changeStep()
        } catch (e) {
            trackError("Failed setup push notifications")
            console.error(e)
        }
    }, [changeStep])

    useEffect(() => {
        if (!hasLocation) return
        requestPermission()
    }, [hasLocation, requestPermission])
}

export function Permissions({ changeStep }: { changeStep: () => void }) {
    useEffect(() => trackPageView("grant-permissions"), [])
    const { locationError, askForUserLocation, hasLocation } = useUserLocation()
    useNotificationAccess(hasLocation, changeStep)

    return (
        <div className="location-page">
            <header className="page-header">
                <h1>Allow location and notification access</h1>

                {locationError && <p>Give permission to continue</p>}
            </header>

            {!locationError ? (
                <button onClick={changeStep} className="btn btn-primary">
                    Continue
                </button>
            ) : (
                <button onClick={askForUserLocation} className="btn btn-primary">
                    Try again
                </button>
            )}
        </div>
    )
}
