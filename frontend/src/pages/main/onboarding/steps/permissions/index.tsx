import React, { useEffect, useState, useCallback } from "react"
import { useMutation, gql } from "@apollo/client"
import { trackPageView, trackEvent } from "lib/analytics"

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
                }
            )
        } else {
            rej()
        }
    })
}

function useUserLocation(changeStep: () => void) {
    const [locationError, setLocationError] = useState(false)
    const [hasLocation, setHasLocation] = useState(false)

    const [setLocation] = useMutation(gql`
        mutation SetLocation($location: LocationInput) {
            setLocation(location: $location)
        }
    `)

    const checkGeolocation = useCallback(async () => {
        try {
            const location = await getGeolocation()
            setHasLocation(true)
            await setLocation({ variables: { location } })
            return changeStep()
        } catch (e) {
            setLocationError(true)
        }
    }, [setLocation, changeStep])

    useEffect(() => {
        checkGeolocation()
    }, [checkGeolocation])

    const askForUserLocation = async () => {
        trackEvent("Ask for user location", {
            category: "Request Permissions",
            label: "onboarding",
        })

        const res = await navigator.permissions.query({ name: "geolocation" })

        if (res.state === "prompt" || res.state === "granted") {
            const location = await getGeolocation()
            setHasLocation(true)
            await setLocation({ variables: { location } })
            setLocationError(false)
            changeStep()
        }
    }

    return {
        locationError,
        askForUserLocation,
        hasLocation,
    }
}

export function Permissions({ changeStep }: { changeStep: () => void }) {
    useEffect(() => trackPageView("grant-permissions"), [])

    const { locationError, askForUserLocation } = useUserLocation(changeStep)

    return (
        <div className="location-page">
            <header className="page-header">
                <h1>Allow location access</h1>

                {locationError && <p>We need your location to find groups in your nearby</p>}
            </header>

            {locationError && (
                <button onClick={askForUserLocation} className="btn btn-primary">
                    Try again
                </button>
            )}
        </div>
    )
}
