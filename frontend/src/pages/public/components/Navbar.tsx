import React from "react"
import "./Navbar.scss"

export function Navbar() {
    return (
        <nav className="public-navbar">
            <div>
                <img alt="beam" src={require("assets/images/beam-logo-dark.png")}></img>
            </div>
        </nav>
    )
}
