import React, { useState } from "react"
import { ConnectAccountStep } from "./steps/connect"
import { FindFriends } from "./steps/find-friends"
import "./style.scss"

export function OnBoarding() {
    const [step, changeStep] = useState(0)

    return (
        <div className="onboarding-page">
            <header>
                <img alt="Beam logo" src={require("assets/images/beam-logo-dark.png")} />
            </header>

            {step === 0 && <ConnectAccountStep changeStep={() => changeStep(step + 1)} />}
            {step === 1 && <FindFriends />}
        </div>
    )
}
