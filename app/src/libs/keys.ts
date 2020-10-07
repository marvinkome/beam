function getConfig(dev: string, prod: string) {
    if (__DEV__) return dev
    return prod
}

export const AUTH_TOKEN = getConfig("Beam_Auth_Token_Dev", "Beam_Auth_Token_Prod")

// APP URLS
export const WEB_URL = getConfig("https://usebeam.chat", "https://usebeam.chat")
export const API_URL = getConfig("http://127.0.0.1:5055", "https://api.usebeam.chat")
export const API_WS_URL = getConfig("ws://127.0.0.1:5055", "wss://api.usebeam.chat")
