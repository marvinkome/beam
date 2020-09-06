import React from "react"
import "./LocationPermission.scss"

export function LocationPermission(props: { getLocation: () => void }) {
    const askForLocation = async () => {
        const res = await navigator?.permissions?.query({ name: "geolocation" })
        if (res?.state === "prompt" || res?.state === "granted") {
            props.getLocation()
        }
    }

    return (
        <div className="request-location">
            <header className="page-header">
                <h1>We need your location to find friends near you</h1>
                <p>Grant location access from site settings and try again</p>
            </header>

            <footer className="button-container">
                <button onClick={askForLocation} className="btn btn-primary">
                    Try again
                </button>
            </footer>
        </div>
    )
}
