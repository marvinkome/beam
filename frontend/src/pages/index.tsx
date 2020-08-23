import React, { useRef, useEffect } from "react"
import Loader from "components/loader"
import ReactGA from "react-ga"
import OneSignal from "react-onesignal"
import { ToastContainer, Slide } from "react-toastify"
import { ApolloProvider } from "@apollo/client"
import { Router, Switch, Route } from "react-router-dom"
import { history } from "lib/history"
import { apolloClient } from "lib/graphql"
import { PWAEventContext } from "lib/pwa"
import { GA_TRACKING_ID, ONESIGNAL_ID } from "lib/keys"
import { trackTiming } from "lib/GA"
import amplitude from "lib/amplitude"

// pages
import { PublicPages } from "pages/public"
import { MainPages } from "pages/main"

import "react-toastify/dist/ReactToastify.css"

amplitude.initAmplitude()
ReactGA.initialize(GA_TRACKING_ID)
OneSignal.initialize(ONESIGNAL_ID, { allowLocalhostAsSecureOrigin: true })

export function RootPage() {
    useEffect(() => trackTiming(), [])

    // hide prompt
    const prompt = useRef<any>()
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault()

        prompt.current = e
    })

    return (
        <PWAEventContext.Provider value={prompt}>
            <ApolloProvider client={apolloClient}>
                <Router history={history}>
                    <Switch>
                        <Route path="/app" component={MainPages} />
                        <Route path="/" component={PublicPages} />
                        <Route path="*" component={() => <p>404 page</p>} />
                    </Switch>
                </Router>

                <Loader />
                <ToastContainer
                    position="bottom-center"
                    closeButton={false}
                    hideProgressBar={true}
                    transition={Slide}
                />
            </ApolloProvider>
        </PWAEventContext.Provider>
    )
}
