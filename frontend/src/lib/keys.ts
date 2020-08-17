function getKey(dev: string, prod: string) {
    if (process.env.NODE_ENV === "production") {
        return prod
    }

    if (process.env.NODE_ENV === "development") {
        return dev
    }

    return ""
}

export const AUTH_TOKEN = getKey("Beam_Auth_Token_Dev", "Beam_Auth_Token_Prod")
export const ONBOARDING_KEY = getKey("Beam_Done_Onboarding", "Beam_Done_Onboarding")

// APP URLS
export const APP_URL = getKey("http://localhost:3000", "https://usebeam.chat")
export const API_URL = getKey("http://localhost:5055", "https://api.usebeam.chat")
export const API_WS_URL = getKey("ws://localhost:5055", "wss://api.usebeam.chat")

// CLIENT IDs
export const FACEBOOK_ID = getKey("1019743245095734", "1019743245095734")
export const GOOGLE_CLIENT_ID = getKey(
    "992903294041-lp2gn624a9h5pakko33q6idlo704j6s9.apps.googleusercontent.com",
    "992903294041-lp2gn624a9h5pakko33q6idlo704j6s9.apps.googleusercontent.com"
)
export const REDDIT_CLIENT_ID = getKey("h1wDUX4u7y3I2A", "lTZSlNpg4PRrCw")
export const SPOTIFY_CLIENT_ID = getKey(
    "ebea92c1be194acc811a3315d8b1a25a",
    "ebea92c1be194acc811a3315d8b1a25a"
)

// OTHER KEYS
export const GA_TRACKING_ID = getKey("", "UA-175561104-1")
export const ONESIGNAL_ID = getKey(
    "7445a6f6-ed0f-4540-972f-6f0e6a3ec275",
    "a8088d81-d46e-40d9-a2f9-5e8a64230844"
)
