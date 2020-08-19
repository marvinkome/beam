import axios from "axios"
import { startLoader } from "components/loader"
import useRedditConnect from "./reddit"
import useYoutubeConnect from "./youtube"
import useSpotifyConnect from "./spotify"

export const setupAxios = (url: string, token: string) => {
    const axiosInst = axios.create({
        baseURL: url,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    })

    let loaderCompleteCb: () => void

    axiosInst.interceptors.request.use((config) => {
        loaderCompleteCb = startLoader()

        return config
    })

    axiosInst.interceptors.response.use(
        (response) => {
            loaderCompleteCb()

            return response
        },
        (error) => {
            loaderCompleteCb()
            return error
        }
    )

    return axiosInst
}

export const useConnectAccount = (
    account: "reddit" | "youtube" | "spotify",
    onConnect: (completed: boolean) => void
) => {
    const [youtubeConnect] = useYoutubeConnect(onConnect)
    const [redditConnect] = useRedditConnect(onConnect)
    const [spotifyConnect] = useSpotifyConnect(onConnect)

    switch (account) {
        case "youtube":
            return youtubeConnect
        case "reddit":
            return redditConnect
        case "spotify":
            return spotifyConnect
    }
}

export { default as useYouTubeConnect } from "./youtube"
export { default as useRedditConnect } from "./reddit"
export { default as useSpotifyConnect } from "./spotify"
