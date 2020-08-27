import React, { useRef, useEffect } from "react"
import Loader from "components/loader"
import { ToastContainer, Slide } from "react-toastify"
import { ApolloProvider } from "@apollo/client"
import { Router, Switch, Route, Redirect } from "react-router-dom"
import { history } from "lib/history"
import { apolloClient } from "lib/graphql"
import { PWAEventContext } from "lib/pwa"
import { trackTiming } from "lib/analytics"
import { initAnalytics } from "lib/analytics"

// pages
import { PublicPages } from "pages/public"
import { MainPages } from "pages/main"

import "react-toastify/dist/ReactToastify.css"

initAnalytics()

export function RootPage() {
    useEffect(() => trackTiming(), [])

    // hide prompt
    const pwaInstallPrompt = useRef<any>()
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault()
        pwaInstallPrompt.current = e
    })

    return (
        <PWAEventContext.Provider value={pwaInstallPrompt}>
            <ApolloProvider client={apolloClient}>
                <Router history={history}>
                    <Switch>
                        <Route path="/app" component={MainPages} />
                        <Route path="/" component={PublicPages} />
                        <Redirect to="/" />
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
