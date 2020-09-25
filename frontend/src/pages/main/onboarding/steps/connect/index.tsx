import React, { useEffect } from "react"
import { ConnectAccount } from "components/connect-account"
import { trackPageView } from "lib/analytics"
import "./style.scss"

export function ConnectAccountStep(props: { changeStep: () => void }) {
    useEffect(() => trackPageView("connect-accounts-page"), [])

    return (
        <main className="connect-account-page">
            <header className="page-header">
                <h1>Connect your accounts</h1>

                <p>
                    Your interests on these platforms help us pair you with people who love the same
                    things.
                </p>
            </header>

            <section className="page-content">
                <ConnectAccount onConnectAll={props.changeStep} />
            </section>

            <button onClick={props.changeStep} className="btn btn-primary">
                Continue
            </button>
        </main>
    )
}
