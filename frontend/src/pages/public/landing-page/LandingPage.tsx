import React from "react"
import cls from "classnames"
import { Navbar } from "../components/Navbar"
import { useGoogleLogin } from "hooks"
import { Footer } from "../components/Footer"
import "./LandingPage.scss"
import { isMobile } from "lib/helpers"

export function LandingPageView(props: { onRegister: () => void }) {
    const { signIn: signUp, loaded } = useGoogleLogin({
        loginType: "register",
        onAuthCb: props.onRegister,
    })

    const { signIn } = useGoogleLogin({ loginType: "login" })

    return (
        <div className="landing-page">
            <Navbar />

            <div className="page-content">
                <h1>Chat with local friends who love what you love</h1>

                {/* image */}
                <img
                    alt="Mobile screenshot of beam"
                    src={require("assets/images/screenshot.png")}
                />

                {/* cta */}
                <div className="header-actions">
                    <button
                        onClick={signUp}
                        className={cls("btn btn-primary", { disabled: !loaded })}
                    >
                        Sign up with Google
                    </button>

                    {isMobile() ? (
                        <p>
                            Already have an account?{" "}
                            <button
                                onClick={signIn}
                                className={cls("link-button", { disabled: !loaded })}
                            >
                                Log In
                            </button>
                        </p>
                    ) : (
                        <p>Already have an account? Login on mobile</p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}
