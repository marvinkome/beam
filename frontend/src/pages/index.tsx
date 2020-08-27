import React, { useRef, useEffect, Suspense } from "react"
import Loader from "components/loader"
import ReactGA from "react-ga"
import firebase from "firebase/app"
import amplitude from "lib/amplitude"
import { PageLoader } from "components/page-loader"
import { ToastContainer, Slide } from "react-toastify"
import { ApolloProvider } from "@apollo/client"
import { Router, Switch, Redirect, Route } from "react-router-dom"
import { history } from "lib/history"
import { apolloClient } from "lib/graphql"
import { PWAEventContext } from "lib/pwa"
import { GA_TRACKING_ID, FIREBASE_CONFIG } from "lib/keys"
import { trackTiming } from "lib/GA"

// pages
import { MainPages } from "./main"
import { PublicPages } from "./public"

import "firebase/analytics"
import "react-toastify/dist/ReactToastify.css"

// INIT 3RD PARTY
amplitude.initAmplitude()
ReactGA.initialize(GA_TRACKING_ID)
firebase.initializeApp(FIREBASE_CONFIG)
firebase.analytics()

export function Root() {
    // GA - track perf
    useEffect(() => trackTiming(), [])

    // hide pwa prompt to use later
    const pwaInstallPrompt = useRef<any>()
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault()
        pwaInstallPrompt.current = e
    })

    return (
        <PWAEventContext.Provider value={pwaInstallPrompt}>
            <ApolloProvider client={apolloClient}>
                {/* routes */}
                <Router history={history}>
                    <Suspense fallback={<PageLoader />}>
                        <Switch>
                            <Route path="/app" component={MainPages} />
                            <Route path="/" component={PublicPages} />
                            <Redirect to="/" />
                        </Switch>
                    </Suspense>
                </Router>

                {/* general components */}
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
