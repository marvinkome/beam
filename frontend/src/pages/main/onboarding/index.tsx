import React, { useState } from "react"
import { Steps } from "components/steps"
import { ONBOARDING_KEY } from "lib/keys"

// steps
import { Download } from "./steps/download"
import { ConnectAccount } from "./steps/connect"
import { Permissions } from "./steps/permissions"
import { SuggestedFriends } from "./steps/suggested-friends"
import "./style.scss"

export function OnBoarding() {
    const savedStep = localStorage.getItem(ONBOARDING_KEY)
    const [currentStep, setStep] = useState(parseInt(savedStep || "0", 10))

    const changeStep = (step: number) => {
        setStep(step)
        localStorage.setItem(ONBOARDING_KEY, `${step}`)
    }

    return (
        <div className="onboarding">
            <Steps stepsCount={4} currentStep={currentStep} />

            <div className="onboarding-page">
                {currentStep === 0 && <Download changeStep={() => changeStep(currentStep + 1)} />}
                {currentStep === 1 && (
                    <Permissions changeStep={() => changeStep(currentStep + 1)} />
                )}
                {currentStep === 2 && (
                    <ConnectAccount changeStep={() => changeStep(currentStep + 1)} />
                )}
                {currentStep === 3 && (
                    <SuggestedFriends changeStep={() => changeStep(currentStep + 1)} />
                )}
            </div>
        </div>
    )
}
