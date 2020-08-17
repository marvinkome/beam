import React from "react"
import "./style.scss"

export function Steps(props: { stepsCount: number; currentStep: number }) {
    return (
        <div className="progress">
            <p>
                Step {props.currentStep + 1} of {props.stepsCount}
            </p>
        </div>
    )
}
