import React, { useState } from "react"

// steps
import { Permissions } from "./steps/permissions"
import { JoinGroups } from "./steps/joinGroups"

import "./style.scss"

export function OnBoarding() {
    const [currentStep, setStep] = useState(0)

    const changeStep = (step: number) => {
        setStep(step)
    }

    return (
        <div className="onboarding">
            {/* <Steps stepsCount={2} currentStep={currentStep} /> */}

            <div className="onboarding-page">
                {currentStep === 0 && (
                    <Permissions changeStep={() => changeStep(currentStep + 1)} />
                )}

                {currentStep === 1 && <JoinGroups changeStep={() => changeStep(currentStep + 1)} />}
            </div>
        </div>
    )
}
