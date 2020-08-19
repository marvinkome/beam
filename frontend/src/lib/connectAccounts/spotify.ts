import { SPOTIFY_CLIENT_ID, APP_URL } from "lib/keys"
import { useSpotifyLogin, useConnectAccount } from "lib/hooks"
import { SpotifyResponseData } from "lib/hooks/spotifyLogin"
import { setupAxios } from "."
import { AxiosInstance } from "axios"
import { trackError } from "lib/GA"
import { toast } from "react-toastify"

let axiosInstance: AxiosInstance | undefined

async function makeTopArtistsRequest(link: string | null = null) {
    try {
        const resp = await axiosInstance?.get(link || "/me/top/artists")
        return resp?.data
    } catch (err) {
        return {}
    }
}

async function getTopArtistsAndGenres() {
    const artists = []
    const genres = new Set<string>()
    let next = null

    const { items, ...resp } = await makeTopArtistsRequest()
    next = resp.next

    for (let item of items) {
        artists.push({
            id: item.id,
            name: item.name,
        })

        item.genres.forEach((genre: string) => genres.add(genre))
    }

    // go through total pages and repeat process
    while (next) {
        // make subsequent requests
        const { items, pageInfo, ...resp } = (await makeTopArtistsRequest(next)) as any
        next = resp.next

        // set subs
        for (let item of items) {
            artists.push({
                id: item.id,
                name: item.name,
            })

            item.genres.forEach((genre: string) => genres.add(genre))
        }
    }

    return { artists, genres: Array.from(genres) }
}

export default function useSpotifyConnect(onCompleted: (completed: boolean) => void) {
    const connectAccount = useConnectAccount()

    const getUserData = async (res: SpotifyResponseData) => {
        const token = res.access_token

        if (!token) {
            toast.error("Failed to connect your Spotify account. Please try again")
            trackError("Failed to connect with Spotify")
            onCompleted(false)
            return
        }

        axiosInstance = setupAxios("https://api.spotify.com/v1", token)
        const { artists, genres } = await getTopArtistsAndGenres()

        const resp = await connectAccount({
            variables: {
                input: {
                    account: "spotify",
                    artists,
                    genres,
                },
            },
        })

        if (resp.data.connectAccount) {
            onCompleted(true)
        }
    }

    const signIn = useSpotifyLogin({
        clientId: SPOTIFY_CLIENT_ID,
        scope: "user-top-read",
        redirectUri: `${APP_URL}/app`,
        onSuccess: getUserData,
    })

    return [signIn]
}
