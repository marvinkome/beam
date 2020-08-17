import React, { useEffect } from "react"
import { usePWAPrompt } from "lib/pwa"
import { trackUserEvent, trackPageView, trackError } from "lib/GA"
import "./style.scss"

export function Download(props: { changeStep: () => void }) {
    useEffect(() => trackPageView("download-page"), [])

    const { current: pwaPrompt } = usePWAPrompt()

    const onDownload = () => {
        if (!pwaPrompt) {
            console.error("Failed to get install prompt", pwaPrompt)
            trackError("Failed to get install prompt")
            props.changeStep()

            return
        }

        pwaPrompt.prompt()

        pwaPrompt.userChoice.then((choice: any) => {
            if (choice.outcome === "accepted") {
                // move to next step
                props.changeStep()
                trackUserEvent("Download Beam")
            } else {
                console.log("User dismissed the install prompt")
                props.changeStep()
                return
            }
        })
    }

    return (
        <div className="download-page">
            <div className="page-header">
                <h1>Click the download button to add the Beam App to home screen</h1>
            </div>

            <div className="page-content">
                <button onClick={onDownload} className="btn btn-primary">
                    Download Beam App
                </button>

                <span className="or">OR</span>

                <button onClick={props.changeStep} className="link-button">
                    Continue on web
                </button>
            </div>
        </div>
    )
}
