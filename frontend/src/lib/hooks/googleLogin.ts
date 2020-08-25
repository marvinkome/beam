import { useHistory, useParams } from "react-router-dom"
import { useMutation, gql } from "@apollo/client"
import { useGoogleLogin } from "react-google-login"
import { AUTH_TOKEN, GOOGLE_CLIENT_ID } from "lib/keys"
import { toast } from "react-toastify"
import { trackError } from "lib/GA"
import { ConnectYoutubeAccount } from "lib/connect-account"
import amplitude from "lib/amplitude"
import { redirectUri } from "lib/helpers"

export default function useGoogle(onAuthCb?: () => void) {
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
            amplitude.setUser(user.id)

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

    const login = useGoogleLogin({
        clientId: GOOGLE_CLIENT_ID,
        cookiePolicy: "single_host_origin",
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        onSuccess: onGoogleLogin,
        onFailure: () => trackError("Authentication with Google failed"),
    })

    return login
}
