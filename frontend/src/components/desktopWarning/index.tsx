import React from "react"
import { Navbar } from "pages/public/components/Navbar"
import { Footer } from "pages/public/components/Footer"
import "./index.scss"

export function DesktopWarning() {
    return (
        <div className="desktop-warning">
            <div className="header-container">
                <Navbar />

                <div className="grid-container">
                    <div className="grid-1">
                        <div className="info-container">
                            <div className="text-section">
                                <h1>Continue on mobile</h1>

                                <p>
                                    Hey, you’re on desktop. And Beam is only available on mobile for
                                    now.{" "}
                                </p>

                                <p>
                                    Visit the url <span className="text-link">usebeam.chat</span> on
                                    any mobile brower to continue.
                                </p>

                                <p>We’ve also sent you an email with details on using Beam.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid-2">
                        <img
                            alt="Mobile screenshot of Beam"
                            src={require("assets/images/screenshot.png")}
                        ></img>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
