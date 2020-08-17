import ReactGA from "react-ga"

export function trackUserEvent(action: string, label?: string) {
    ReactGA.event({
        category: "User",
        action,
        label,
    })
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
