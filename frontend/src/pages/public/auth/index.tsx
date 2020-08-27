import React, { useEffect, useState } from "react"
import GoogleLogin from "react-google-login"
import { toast } from "react-toastify"
import { useMutation, gql } from "@apollo/client"
import { useHistory, useParams } from "react-router-dom"
import { GOOGLE_CLIENT_ID, AUTH_TOKEN } from "lib/keys"
import { trackEvent } from "lib/analytics"
import { redirectUri } from "lib/helpers"

import "./style.scss"

function useInvite() {
    const [isLoading, setLoading] = useState(true)

    const history = useHistory()
    const { inviteToken } = useParams()

    const authenticated = !!localStorage.getItem(AUTH_TOKEN)
    const [addFriend] = useMutation(gql`
        mutation AddFriend($inviteToken: String!) {
            addFriend(inviteToken: $inviteToken) {
                success
                message
            }
        }
    `)

    useEffect(() => {
        if (inviteToken && authenticated) {
            addFriend({ variables: { inviteToken } }).then((resp) => {
                const { success } = resp.data?.addFriend

                if (!success) {
                    toast.error("Invite token is invalid")
                }

                history.push(redirectUri())
            })
        } else {
            setLoading(false)
        }
    }, [addFriend, authenticated, history, inviteToken])

    return isLoading
}

function useAuthLogin() {
    const history = useHistory()
    const { inviteToken } = useParams()

    const [googleLogin] = useMutation(gql`
        mutation GoogleLogin($token: String!, $inviteToken: String) {
            googleLogin(token: $token, inviteToken: $inviteToken) {
                success
                token
            }
        }
    `)

    const onGoogleLogin = async (resp: any) => {
        const accessToken = resp.accessToken
        const loginResp = await googleLogin({ variables: { token: accessToken, inviteToken } })
        const { token, success } = loginResp.data?.googleLogin

        if (success) {
            localStorage.setItem(AUTH_TOKEN, token)

            return history.push(redirectUri())
        } else {
            toast.error("Invite token is invalid")
        }
    }

    return {
        googleLogin: onGoogleLogin,
    }
}

export function AuthPage() {
    const isLoading = useInvite()
    const { googleLogin } = useAuthLogin()

    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div className="auth-page">
            <h1>You've been invited, sign up to chat</h1>

            <div className="signin-options">
                <GoogleLogin
                    clientId={GOOGLE_CLIENT_ID}
                    onSuccess={googleLogin}
                    onFailure={(e) => console.log("Failed to sign up with Google", e)}
                    render={({ onClick, disabled }) => (
                        <button
                            className={`btn btn-primary-outline google ${disabled}`}
                            onClick={() => {
                                onClick()
                                trackEvent("Sign up with Google", {
                                    category: "Auth",
                                    label: "invite",
                                })
                            }}
                        >
                            <img alt="google-signup" src={require("assets/images/google.png")} />
                            <span>Sign up with Google</span>
                        </button>
                    )}
                />
            </div>

            <p className="terms">
                By signing up, you agree to our <a href="/terms">Terms’s &amp; Conditions</a> and{" "}
                <a href="/terms">Privacy Policy</a>.
            </p>
        </div>
    )
}
