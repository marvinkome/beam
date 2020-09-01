import React from "react"
import cls from "classnames"
import { Navbar } from "../components/Navbar"
import { FaCheck } from "react-icons/fa"
import { useGoogleLogin } from "hooks"
import { Footer } from "../components/Footer"
import "./LandingPage.scss"

export function LandingPageView(props: { onRegister: () => void }) {
    const { signIn: signUp, loaded } = useGoogleLogin({
        loginType: "register",
        onAuthCb: props.onRegister,
    })

    const { signIn } = useGoogleLogin({ loginType: "login" })

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

                                <p>
                                    Find people with similar interests on YouTube, Spotify, and
                                    Reddit
                                </p>
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

                        <div className="header-cta">
                            <button
                                onClick={signUp}
                                className={cls("btn btn-primary", { disabled: !loaded })}
                            >
                                Sign up with Google
                            </button>

                            <p>
                                Already have an account?{" "}
                                <button
                                    onClick={signIn}
                                    className={cls("link-button", { disabled: !loaded })}
                                >
                                    Log In
                                </button>
                            </p>
                        </div>
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
