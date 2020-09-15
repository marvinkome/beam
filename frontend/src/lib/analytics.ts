import ReactGA from "react-ga"
import mixpanel from "mixpanel-browser"
import { GA_TRACKING_ID, MIXPANEL_ID } from "./keys"

// INIT
export function initAnalytics() {
    // mixpanel
    if (MIXPANEL_ID) {
        mixpanel.init(MIXPANEL_ID)
    }

    // Google analytics
    ReactGA.initialize(GA_TRACKING_ID)
}

// SETUP
export function setUser(userId: string, props?: any) {
    ReactGA.set({
        user_id: userId,
    })

    if (!MIXPANEL_ID) return

    mixpanel.identify(userId)

    if (props) {
        mixpanel.people.set(props)
    }
}

// EVENTS
export function trackLinks() {
    if (MIXPANEL_ID) {
        mixpanel.track_links("a[href]", "click link", {
            referrer: document.referrer,
        })
    }
}

export function trackEvent(event: string, props?: any) {
    if (MIXPANEL_ID) mixpanel.track(event, props)
    ReactGA.event({ action: event, category: props?.category || "User", label: props?.label })
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
