import PopupWindow from "lib/popupWindow"
import { useGoogleLogin as _useGoogleLogin, GoogleLoginResponse } from "react-google-login"
import { useMutation, gql } from "@apollo/client"
import { startLoader } from "components"
import {
    ConnectYoutubeAccount,
    ConnectRedditAccount,
    ConnectSpotifyAccount,
} from "lib/connect-account"
import { toast } from "react-toastify"
import { GOOGLE_CLIENT_ID, REDDIT_CLIENT_ID, APP_URL, SPOTIFY_CLIENT_ID } from "lib/keys"
import { toQuery } from "lib/helpers"
import { trackError, trackEvent } from "lib/analytics"

export function useConnectAccountMutation() {
    const [connectAccount] = useMutation(gql`
        mutation ConnectAccount($input: ConnectAccountInput) {
            connectAccount(input: $input)
        }
    `)

    return connectAccount
}

export function useYouTubeConnect(onCompleted: (completed: boolean) => void) {
    const connectAccount = useConnectAccountMutation()

    const getUserData = async (res: any) => {
        const token = (res as GoogleLoginResponse).accessToken

        if (!token) {
            toast.error("Failed to connect your YouTube account. Please try again")
            trackError("Failed to connect with Youtube")
            onCompleted(false)
            return
        }

        let stopLoader = startLoader()

        const youtube = new ConnectYoutubeAccount(token)
        const subs = await youtube.getSubscriptions()

        const resp = await connectAccount({
            variables: {
                input: {
                    account: "youtube",
                    subs,
                },
            },
        })

        stopLoader && stopLoader()
        if (resp.data.connectAccount) {
            trackEvent("Connected youtube account", { category: "Connect" })
            onCompleted(true)
        }
    }

    const { signIn } = _useGoogleLogin({
        clientId: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        onSuccess: getUserData,
    })

    return signIn
}

export function useRedditConnect(onCompleted: (completed: boolean) => void) {
    const connectAccount = useConnectAccountMutation()

    const onRedditLogin = async (res: any) => {
        const token = res.access_token

        if (!token) {
            toast.dark("Failed to connect your Reddit account. Please try again")
            trackError("Failed to connect with Reddit")
            onCompleted(false)

            return
        }

        let stopLoader = startLoader()

        // get subreddits
        const reddit = new ConnectRedditAccount(token)
        const subreddits = await reddit.getSubreddits()

        const { data } = await connectAccount({
            variables: {
                input: {
                    account: "reddit",
                    subreddits,
                },
            },
        })

        stopLoader && stopLoader()
        if (data.connectAccount) {
            trackEvent("Connected reddit account", { category: "Connect" })
            return onCompleted(true)
        }
    }

    const query = toQuery({
        client_id: REDDIT_CLIENT_ID,
        response_type: "token",
        state: "ranDomsPacestAte",
        redirect_uri: encodeURIComponent(`${APP_URL}/oauth-redirect`),
        scope: "mysubreddits",
    })

    const signIn = () => {
        PopupWindow.open(
            "reddit-oauth-auth",
            `https://www.reddit.com/api/v1/authorize.compact?${query}`,
            {
                height: 800,
                width: 600,
            }
        )
            ?.then((data) => onRedditLogin(data))
            .catch(() => trackError("Authentication with Reddit failed"))
    }

    return signIn
}

export function useSpotifyConnect(onCompleted: (completed: boolean) => void) {
    const connectAccount = useConnectAccountMutation()

    const onSpotifyLogin = async (res: any) => {
        const token = res.access_token

        if (!token) {
            toast.dark("Failed to connect your Spotify account. Please try again")
            trackError("Failed to connect with Spotify")
            onCompleted(false)

            return
        }

        let stopLoader = startLoader()

        // get spotify data
        const spotify = new ConnectSpotifyAccount(token)
        const { artists, genres } = await spotify.getTopArtistsAndGenres()

        const { data } = await connectAccount({
            variables: {
                input: {
                    account: "spotify",
                    artists,
                    genres,
                },
            },
        })

        stopLoader && stopLoader()
        if (data.connectAccount) {
            trackEvent("Connected spotify account", { category: "Connect" })
            onCompleted(true)
        }
    }

    const query = toQuery({
        client_id: SPOTIFY_CLIENT_ID,
        response_type: "token",
        redirect_uri: encodeURIComponent(`${APP_URL}/oauth-redirect`),
        scope: "user-top-read",
    })

    const signIn = () => {
        PopupWindow.open("spotify-oauth-auth", `https://accounts.spotify.com/authorize?${query}`, {
            height: 800,
            width: 600,
        })
            ?.then((data) => onSpotifyLogin(data))
            .catch(() => trackError("Authentication with Spotify failed"))
    }

    return signIn
}

export function useConnectAccount(
    account: "reddit" | "youtube" | "spotify",
    onConnect: (completed: boolean) => void
) {
    const youtubeConnect = useYouTubeConnect(onConnect)
    const redditConnect = useRedditConnect(onConnect)
    const spotifyConnect = useSpotifyConnect(onConnect)

    switch (account) {
        case "youtube":
            return youtubeConnect
        case "reddit":
            return redditConnect
        case "spotify":
            return spotifyConnect
    }
}

export function useDisconnectAccount(account: "reddit" | "youtube" | "spotify") {
    const [disconnectAccount] = useMutation(
        gql`
            mutation DisconnectAccount($account: String!) {
                disconnectAccount(account: $account)
            }
        `
    )

    switch (account) {
        case "youtube":
            return () => disconnectAccount({ variables: { account: "youtube" } })
        case "reddit":
            return () => disconnectAccount({ variables: { account: "reddit" } })
        case "spotify":
            return () => disconnectAccount({ variables: { account: "spotify" } })
    }
}
