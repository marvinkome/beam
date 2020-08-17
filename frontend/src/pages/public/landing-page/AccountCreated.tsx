import React from "react"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import "./AccountCreated.scss"

export function AccountCreated() {
    return (
        <div className="account-created">
            <Navbar />

            <div className="info-container">
                <div className="text-section">
                    <h1>You’ve created a Beam account</h1>
                    <img alt="confetti emoji" src={require("assets/images/confetti.png")}></img>

                    <h2>
                        We’ve sent you an email with the link{" "}
                        <a href="https://usebeam.chat">usebeam.chat</a>. You can open it on mobile.
                    </h2>
                </div>
            </div>

            <Footer />
        </div>
    )
}
