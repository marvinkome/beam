import React from "react"
import cls from "classnames"
import { Navbar } from "../components/Navbar"
import { FaCheck } from "react-icons/fa"
import { useGoogleLogin } from "lib/hooks"
import { Footer } from "../components/Footer"
import { trackEvent } from "lib/analytics"
import "./LandingPage.scss"

export function LandingPageView(props: { onRegister: () => void }) {
    const { signIn, loaded } = useGoogleLogin(false, props.onRegister)
    const signUp = (type: string) => {
        signIn()
        trackEvent("Sign up with CTA button", { category: "Auth", label: type })
    }

    return (
        <div className="landing-page">
            <div className="header-container">
                <Navbar />

                <div className="header-grid">
                    <div className="text-grid">
                        <h1>Chat with friends in your city who share your interests</h1>

                        <div className="check-list">
                            <div className="check">
                                <FaCheck className="icon" />
                                <p>Find people with similar interests on YouTube, Spotify, and Reddit</p>
                            </div>

                            <div className="check">
                                <FaCheck className="icon" />
                                <p>Join a local group for your YouTube subscriptions</p>
                            </div>

                            <div className="check">
                                <FaCheck className="icon" />
                                <p>No Ads</p>
                            </div>

                            <div className="check">
                                <FaCheck className="icon" />
                                <p>No blue theme</p>
                            </div>
                        </div>

                        <button
                            onClick={() => signUp("header")}
                            className={cls("btn btn-primary", { disabled: !loaded })}
                        >
                            Sign up with Google
                        </button>
                    </div>

                    <div className="image-grid">
                        <img
                            alt="Mobile screenshot of beam"
                            src={require("assets/images/screenshot.png")}
                        ></img>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
