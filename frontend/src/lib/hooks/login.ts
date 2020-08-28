import PopupWindow from "lib/popupWindow"
import { useHistory, useParams } from "react-router-dom"
import { useMutation, gql } from "@apollo/client"
import { toast } from "react-toastify"
import {
    ConnectYoutubeAccount,
    ConnectRedditAccount,
    ConnectSpotifyAccount,
} from "lib/connect-account"
import {
    AUTH_TOKEN,
    GOOGLE_CLIENT_ID,
    REDDIT_CLIENT_ID,
    APP_URL,
    SPOTIFY_CLIENT_ID,
} from "lib/keys"
import { redirectUri, toQuery } from "lib/helpers"
import { trackError, setUser } from "lib/analytics"
import { useGoogleLogin as _useGoogleLogin, GoogleLoginResponse } from "react-google-login"

function useConnectAccountMutation() {
    const [connectAccount] = useMutation(gql`
        mutation ConnectAccount($input: ConnectAccountInput) {
            connectAccount(input: $input)
        }
    `)

    return connectAccount
}

export function useGoogleLogin(onAuthCb?: () => void) {
    const history = useHistory()
    const { inviteToken } = useParams()

    const [googleLogin] = useMutation(gql`
        mutation GoogleLogin($token: String!, $inviteToken: String, $youtubeData: [YoutubeInput]) {
            googleLogin(token: $token, inviteToken: $inviteToken, youtubeData: $youtubeData) {
                success
                token
                user {
                    id
                }
            }
        }
    `)

    const onGoogleLogin = async (resp: any) => {
        const accessToken = resp.accessToken || resp.wc.access_token
        if (!accessToken) {
            toast.error("Failed to authenticate with Google")
            return
        }

        // get youtube subscriptions
        const youtube = new ConnectYoutubeAccount(accessToken)
        const youtubeData = await youtube.getSubscriptions()

        const loginResp = await googleLogin({
            variables: {
                token: accessToken,
                inviteToken,
                youtubeData,
            },
        })
        const { token, success, message, user } = loginResp.data?.googleLogin

        if (success) {
            // Post login activities
            localStorage.setItem(AUTH_TOKEN, token)
            setUser(user.id)

            if (onAuthCb) {
                return onAuthCb()
            } else {
                // check if user is done with onboarding
                return history.push(redirectUri())
            }
        } else {
            // TODO:: ADD LOGGER
            trackError(`Authentication with Google failed - ${message}`)
            console.log(message)
            toast.error("Failed to sign up with Google")
        }
    }

    const login = _useGoogleLogin({
        clientId: GOOGLE_CLIENT_ID,
        cookiePolicy: "single_host_origin",
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        onSuccess: onGoogleLogin,
        onFailure: () => trackError("Authentication with Google failed"),
    })

    return login
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

        if (resp.data.connectAccount) {
            onCompleted(true)
        }
    }

    const { signIn, loaded } = _useGoogleLogin({
        clientId: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        onSuccess: getUserData,
    })

    if (!loaded) {
        toast.dark("Please try again.")
    }

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

        if (data.connectAccount) {
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

        if (data.connectAccount) {
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
