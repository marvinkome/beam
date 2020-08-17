import React, { useState } from "react"
import { isMobile } from "lib/helpers"
import { useHistory } from "react-router-dom"
import { LandingPageView } from "./LandingPage"
import { AccountCreated } from "./AccountCreated"

export function LandingPage() {
    const history = useHistory()
    const [hasRegistered, setHasRegistered] = useState(false)

    const onRegister = () => {
        if (isMobile()) {
            return history.push("/app/onboarding")
        }

        setHasRegistered(true)
    }

    return hasRegistered ? <AccountCreated /> : <LandingPageView onRegister={onRegister} />
}
