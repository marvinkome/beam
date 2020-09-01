import React, { useEffect, useState } from "react"
import { useMutation, gql } from "@apollo/client"
import { useHistory, useParams } from "react-router-dom"
import { useGoogleLogin } from "hooks"
import { AUTH_TOKEN } from "lib/keys"

import "./style.scss"

export function InvitePage() {
    const history = useHistory()
    const { inviteToken } = useParams()
    const authenticated = !!localStorage.getItem(AUTH_TOKEN)

    // state
    const [inviteError, setInviteError] = useState("")

    // mutations
    const [addFriend] = useMutation(gql`
        mutation AddFriend($inviteToken: String!) {
            addFriend(inviteToken: $inviteToken) {
                success
                message
            }
        }
    `)

    // google login
    const { signIn: signUp } = useGoogleLogin({
        loginType: "invite",
        inviteToken,
    })

    useEffect(() => {
        if (localStorage.getItem(AUTH_TOKEN)) {
            // then add friend
            addFriend({ variables: { inviteToken } }).then((resp) => {
                const { success } = resp.data?.addFriend

                if (!success) {
                    return setInviteError(
                        "This invite link is bad. Please ask friend for a new one"
                    )
                }

                history.push("/app/chats")
            })

            return undefined
        }
    }, [addFriend, inviteToken, history])

    return (
        <div className="auth-page">
            <h1>Join your beam friend</h1>

            {authenticated ? (
                <div>{inviteError}</div>
            ) : (
                <>
                    <div className="signin-options">
                        <button className="btn btn-primary-outline google" onClick={signUp}>
                            <img alt="google-signup" src={require("assets/images/google.png")} />
                            <span>Sign up with Google</span>
                        </button>
                    </div>

                    <p className="terms">
                        By signing up, you agree to our{" "}
                        <a href="/terms">Terms’s &amp; Conditions</a> and{" "}
                        <a href="/terms">Privacy Policy</a>.
                    </p>
                </>
            )}
        </div>
    )
}
