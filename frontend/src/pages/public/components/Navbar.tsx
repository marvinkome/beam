import React from "react"
import cls from "classnames"
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

            <button
                onClick={() => {
                    signIn()
                    trackUserEvent("Login with Google")
                }}
                className={cls("btn", { disabled: !loaded })}
            >
                Log in
            </button>
        </nav>
    )
}
