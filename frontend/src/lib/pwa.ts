import React, { useContext } from "react"

export const PWAEventContext = React.createContext<any>(null)

export function usePWAPrompt() {
    const pwaEvent = useContext(PWAEventContext)
    return pwaEvent
}
