function getConfig(dev: string, prod: string) {
    if (process.env.NODE_ENV === "production") return prod
    return dev
}

export const AUTH_TOKEN = getConfig("Beam_Auth_Token_Dev", "Beam_Auth_Token_Prod")

// APP URLS
export const APP_URL = getConfig("", "")
export const API_URL = getConfig("http://10.0.2.2:5055", "https://api.usebeam.chat")
export const API_WS_URL = getConfig("ws://10.0.2.2:5055", "wss://api.usebeam.chat")
