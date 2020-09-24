import * as Sentry from "@sentry/react"
import { useHistory } from "react-router-dom"
import { useGoogleLogin as useReactGoogleLogin } from "react-google-login"
import { useMutation, gql } from "@apollo/client"
import { toast } from "react-toastify"
import { startLoader } from "components/loader"
import { ConnectYoutubeAccount } from "lib/connect-account"
import { AUTH_TOKEN, GOOGLE_CLIENT_ID } from "lib/keys"
import { setUser, trackEvent } from "lib/analytics"
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
    const [loginMutation] = useMutation(gql`
        mutation Login($data: LoginInput, $inviteToken: String) {
            login(authData: $data, inviteToken: $inviteToken) {
                success
                message
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
        Sentry.addBreadcrumb({
            category: options.loginType,
            message: "Google auth successful",
            level: Sentry.Severity.Info,
        })

        const stopLoader = startLoader("fullscreen", "Setting up your Beam account.")

        // get access token from google
        const accessToken = googleResp.accessToken || googleResp.wc.access_token
        if (!accessToken) {
            toast.dark("Failed to authenticate with Google")
            Sentry.captureMessage("Authentication with Google failed - Access token not found")
            return
        }

        // authenticate user
        const loginResp = await loginMutation({
            variables: {
                inviteToken: options.inviteToken,
                data: {
                    authType: "googleId",
                    id: googleResp.profileObj.googleId,
                    email: googleResp.profileObj.email,
                    name: `${googleResp.profileObj.givenName} ${googleResp.profileObj.familyName}`,
                    picture: googleResp.profileObj.imageUrl,
                },
            },
        })

        // destructure response
        const { token, success, message, user } = loginResp.data?.login
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
            } else {
                stopLoader && stopLoader()
                toast.dark("Failed to connect youtube account")
                Sentry.captureMessage(`Saving youtube subsriptions failed`)
            }
        } else {
            toast.dark(`Error signing up - ${message}`)
            Sentry.captureMessage(`User auth failed - ${message}`)
            stopLoader && stopLoader()
        }
    }

    // setup google login action
    const login = useReactGoogleLogin({
        clientId: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        onSuccess: onGoogleLoginSuccess,
        onRequest: () => {
            Sentry.addBreadcrumb({
                category: options.loginType,
                message: "Google auth request started",
                level: Sentry.Severity.Info,
            })
        },
        onFailure: (resp) => {
            console.error(resp)
            switch (resp.error) {
                case "popup_closed_by_user":
                    toast.dark("Please complete Google login before closing the tab")
                    break
                case "access_denied":
                    toast.dark("You need to give access to continue on Beam")
                    break
            }

            Sentry.captureMessage(resp.error)
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
