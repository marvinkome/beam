import React from "react"
import ReactDOM from "react-dom"
import * as serviceWorker from "lib/serviceWorker"
import App from "pages"

import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"

import "intro.js/introjs.css"
import "styles/index.scss"

// setup sentry
if (process.env.NODE_ENV === "production") {
    Sentry.init({
        dsn: "https://fc9d104893984167822c55e29543a67f@o450307.ingest.sentry.io/5434675",
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 0.5,
    })
}

ReactDOM.render(<App />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
    onUpdate: (reg) => {
        if (window.confirm("We've made Beam better, please click OK to get new updates")) {
            const registrationWaiting = reg.waiting

            if (registrationWaiting) {
                registrationWaiting.postMessage({ type: "SKIP_WAITING" })
                registrationWaiting.addEventListener("statechange", (e) => {
                    if ((e?.target as any)?.state === "activated") {
                        window.location.reload()
                    }
                })
            }
        }
    },
})
