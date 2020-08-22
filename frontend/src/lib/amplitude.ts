import amplitudeJs from "amplitude-js"
import { AMPLITUDE_KEY } from "./keys"

function initAmplitude() {
    amplitudeJs.getInstance().init(AMPLITUDE_KEY, undefined, {
        includeReferrer: true,
    })
}

function setUser(userId: string, props?: any) {
    amplitudeJs.getInstance().setUserId(userId)

    if (props) {
        Object.keys(props).forEach((key) => {
            const id = new amplitudeJs.Identify().set(key, props[key])
            amplitudeJs.getInstance().identify(id)
        })
    }
}

function trackEvent(event: string, props?: any) {
    amplitudeJs.getInstance().logEvent(event, props)
}

const amplitude = {
    initAmplitude,
    setUser,
    trackEvent,
}

export default amplitude
