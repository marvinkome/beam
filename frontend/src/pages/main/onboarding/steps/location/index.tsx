import React, { useEffect, useState } from "react"
import { useMutation, gql } from "@apollo/client"
import { trackPageView, trackUserEvent } from "lib/GA"
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

export function Location({ changeStep }: { changeStep: () => void }) {
    useEffect(() => trackPageView("grant-location"), [])

    const [locationError, setLocationError] = useState(false)

    const [setLocation] = useMutation(gql`
        mutation SetLocation($location: LocationInput) {
            setLocation(location: $location)
        }
    `)

    useEffect(() => {
        getGeolocation()
            .then(async (location) => {
                // store location
                await setLocation({ variables: { location } })
                changeStep()
            })
            .catch(() => {
                setLocationError(true)
            })
    }, [setLocation, changeStep])

    const askForUserLocation = async () => {
        trackUserEvent("Ask for user location", "onboarding")
        const res = await navigator.permissions.query({ name: "geolocation" })

        if (res.state === "prompt") {
            const location = await getGeolocation()
            await setLocation({ variables: { location } })
            changeStep()
            setLocationError(false)
        }
    }

    return (
        <div className="location-page">
            <header className="page-header">
                {!locationError ? (
                    <h1>Allow location access to find friends near you</h1>
                ) : (
                    <h1>
                        Couldn't get your location. We need your location to find friends near you
                    </h1>
                )}
            </header>

            {!locationError ? (
                <button className="btn btn-primary">Continue</button>
            ) : (
                <button onClick={askForUserLocation} className="btn btn-primary">
                    Try again
                </button>
            )}
        </div>
    )
}
