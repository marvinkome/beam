import React from "react"
import { useGoogleLogin } from "lib/hooks"
import { trackUserEvent } from "lib/GA"
import "./Navbar.scss"

export function Navbar() {
    const { signIn, loaded } = useGoogleLogin()

    return (
        <nav className="public-navbar">
            <div>
                <img alt="beam" src={require("assets/images/beam-logo-dark.png")}></img>
            </div>

            {loaded && (
                <button
                    onClick={() => {
                        signIn()
                        trackUserEvent("Login with Google")
                    }}
                    className="btn"
                >
                    Log in
                </button>
            )}
        </nav>
    )
}
