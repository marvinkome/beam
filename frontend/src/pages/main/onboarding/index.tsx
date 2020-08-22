import React, { useState } from "react"
import { Steps } from "components/steps"
import { ONBOARDING_KEY } from "lib/keys"

// steps
import { Permissions } from "./steps/permissions"
import { JoinGroups } from "./steps/joinGroups"
// import { Download } from "./steps/download"
// import { ConnectAccount } from "./steps/connect"
// import { SuggestedFriends } from "./steps/suggested-friends"
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
            <Steps stepsCount={3} currentStep={currentStep} />

            <div className="onboarding-page">
                {currentStep === 0 && (
                    <Permissions changeStep={() => changeStep(currentStep + 1)} />
                )}

                {currentStep === 1 && <JoinGroups changeStep={() => changeStep(currentStep + 1)} />}

                {/* {currentStep === 2 && (
                    <ConnectAccount changeStep={() => changeStep(currentStep + 1)} />
                )}

                {currentStep === 3 && (
                    <SuggestedFriends  />
                )} */}
            </div>
        </div>
    )
}
