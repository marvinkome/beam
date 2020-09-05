import { useRef, useEffect } from "react"
import { startLoader } from "."

export function useLoader(isLoading: boolean, loadingText: string) {
    let stopLoader = useRef<any>()

    useEffect(() => {
        if (isLoading) {
            stopLoader.current = startLoader("fullscreen", loadingText)
        }

        if (!isLoading) {
            stopLoader.current && stopLoader.current()
        }
    }, [isLoading, loadingText])
}
