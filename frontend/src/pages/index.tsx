import React, { useRef, useEffect } from "react"
import { LoaderContainer } from "components/loader"

import { ApolloProvider } from "@apollo/client"
import { Router, Switch, Route, Redirect } from "react-router-dom"
import { ToastContainer, Slide } from "react-toastify"

// libs
import { history } from "lib/history"
import { apolloClient } from "lib/graphql"
import { PWAEventContext } from "lib/pwa"
import { trackTiming, initAnalytics } from "lib/analytics"

// pages
import { PublicPages } from "pages/public"
import { MainPages } from "pages/main"

import "react-toastify/dist/ReactToastify.css"

initAnalytics()

export default function App() {
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
                {/* routes */}
                <Router history={history}>
                    <Switch>
                        {/* app routes */}
                        <Route path="/app" component={MainPages} />

                        {/* public routes  */}
                        <Route path="/" component={PublicPages} />

                        {/* 404 - redirect to landing page */}
                        <Redirect to="/" />
                    </Switch>
                </Router>

                {/* components */}
                <LoaderContainer />
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
