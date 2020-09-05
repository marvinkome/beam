import ReactGA from "react-ga"
import { GA_TRACKING_ID } from "./keys"

// INIT
export function initAnalytics() {
    ReactGA.initialize(GA_TRACKING_ID)
}

// SETUP
export function setUser(userId: string, props?: any) {
    // amplitudeJs.getInstance().setUserId(userId)
    // if (props) {
    //     Object.keys(props).forEach((key) => {
    //         const id = new amplitudeJs.Identify().set(key, props[key])
    //         amplitudeJs.getInstance().identify(id)
    //     })
    // }
}

// EVENTS
export function trackEvent(event: string, props?: any) {
    ReactGA.event({ action: event, category: props.category || "User", label: props.label })
}

export function trackTiming() {
    if (window.performance) {
        // Gets the number of milliseconds since page load
        // (and rounds the result since the value must be an integer).
        const timeSincePageLoad = Math.round(performance.now())

        // Sends the timing hit to Google Analytics.
        ReactGA.timing({
            category: "JS Dependencies",
            variable: "load",
            value: timeSincePageLoad,
        })
    }
}

export function trackError(description: string) {
    ReactGA.exception({
        description,
    })
}

export function trackPageView(page: string) {
    ReactGA.set({ page })
    ReactGA.pageview(page)
}

export function trackModalView(modal: string) {
    ReactGA.modalview(modal)
}
