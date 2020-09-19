import { useHistory } from "react-router-dom"
import { useGoogleLogin as useReactGoogleLogin } from "react-google-login"
import { useMutation, gql } from "@apollo/client"
import { toast } from "react-toastify"
import { startLoader } from "components/loader"
import { ConnectYoutubeAccount } from "lib/connect-account"
import { AUTH_TOKEN, GOOGLE_CLIENT_ID } from "lib/keys"
import { trackError, setUser, trackEvent } from "lib/analytics"
import { useConnectAccountMutation } from "./connect"

type LoginOptions = {
    loginType: "register" | "invite" | "login"
    onAuthCb?: () => void
    inviteToken?: string
}

export function useGoogleLogin(options: LoginOptions) {
    const history = useHistory()
    const connectAccount = useConnectAccountMutation()

    // create api login mutation function
    const [googleLogin] = useMutation(gql`
        mutation GoogleLogin($token: String!, $inviteToken: String) {
            googleLogin(token: $token, inviteToken: $inviteToken) {
                success
                token
                user {
                    id
                    email
                    createdAt
                    hasConnectedAccount
                }
            }
        }
    `)

    const onGoogleLoginSuccess = async (googleResp: any) => {
        trackEvent(
            `Google auth successful - ${options.loginType}`,
            {
                category: "Auth",
                label: options.loginType,
            },
            false
        )

        const stopLoader = startLoader("fullscreen", "Setting up your Beam account.")

        // get access token from google
        const accessToken = googleResp.accessToken || googleResp.wc.access_token
        if (!accessToken) {
            toast.dark("Failed to authenticate with Google")
            trackError(`Authentication with Google failed - Access token not found`)
            return
        }

        // authenticate user
        const loginResp = await googleLogin({
            variables: {
                token: accessToken,
                inviteToken: options.inviteToken,
            },
        })

        // destructure response
        const { token, success, message, user } = loginResp.data?.googleLogin
        if (success) {
            // setup user
            localStorage.setItem(AUTH_TOKEN, token)
            setUser(user.id, {
                $email: user.email,
                signUpDate: new Date(parseInt(user.createdAt, 10)).toISOString(),
            })

            // check if the user has already connect youtube account
            if (user.hasConnectedAccount) {
                stopLoader && stopLoader()
                trackEvent("Auth successful", { category: "Auth", label: options.loginType })

                if (options.onAuthCb) {
                    return options.onAuthCb()
                } else {
                    // if user is signing in
                    return history.push("/app/chats")
                }
            }

            // else connect youtube data
            // get youtube subscriptions
            const youtube = new ConnectYoutubeAccount(accessToken)
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
                trackEvent("Connected youtube account", { category: "Auth", label: "Connect" })

                stopLoader && stopLoader()
                trackEvent("Auth successful", { category: "Auth", label: options.loginType })

                if (options.onAuthCb) {
                    return options.onAuthCb()
                } else {
                    // if user is signing in
                    return history.push("/app/onboarding")
                }
            }
        } else {
            trackError(`User auth failed - ${message}`)
            console.log(message)
            toast.dark(`Error signing up - ${message}`)
            stopLoader && stopLoader()
        }
    }

    // setup google login action
    const login = useReactGoogleLogin({
        clientId: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        onSuccess: onGoogleLoginSuccess,
        onFailure: (resp) => {
            console.error(resp)
            switch (resp.error) {
                case "popup_closed_by_user":
                    toast.dark("Please complete sign up before closing the tab")
                    break
                case "access_denied":
                    toast.dark("You need to give access to continue on Beam")
                    break
            }

            trackError(`Google auth failed - ${resp.error}`)
        },
    })

    return {
        signIn: () => {
            trackEvent(`clicked on google auth for - ${options.loginType}`, {
                category: "Auth",
                label: options.loginType,
            })
            login.signIn()
        },
        loaded: login.loaded,
    }
}
