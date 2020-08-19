import { useHistory, useParams } from "react-router-dom"
import { useMutation, gql } from "@apollo/client"
import { useGoogleLogin } from "react-google-login"
import { AUTH_TOKEN, GOOGLE_CLIENT_ID, ONBOARDING_KEY } from "lib/keys"
import { toast } from "react-toastify"
import { trackError } from "lib/GA"

export default function useLoginWithGoogle(onAuthCb?: () => void) {
    const history = useHistory()
    const { inviteToken } = useParams()

    const [googleLogin] = useMutation(gql`
        mutation GoogleLogin($token: String!) {
            googleLogin(token: $token) {
                success
                token
            }
        }
    `)

    const onGoogleLogin = async (resp: any) => {
        const accessToken = resp.accessToken || resp.wc.access_token
        if (!accessToken) {
            toast.error("Failed to authenticate with Google")
            return
        }

        const loginResp = await googleLogin({ variables: { token: accessToken, inviteToken } })
        const { token, success, message } = loginResp.data?.googleLogin

        if (success) {
            localStorage.setItem(AUTH_TOKEN, token)

            if (onAuthCb) {
                return onAuthCb()
            }

            // check if user is done with onboarding
            return localStorage.getItem(ONBOARDING_KEY) === "3"
                ? history.push("/app/chats")
                : history.push("/app/onboarding")
        } else {
            // TODO:: ADD LOGGER
            trackError(`Authentication with Google failed - ${message}`)
            console.log(message)
            toast.error("Failed to sign up with Google")
        }
    }

    const login = useGoogleLogin({
        clientId: GOOGLE_CLIENT_ID,
        onSuccess: onGoogleLogin,
        onFailure: () => trackError("Authentication with Google failed"),
    })

    return login
}
