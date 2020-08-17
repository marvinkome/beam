import React from "react"
import "./Footer.scss"

export function Footer() {
    return (
        <footer className="public-footer">
            <p className="feedback-text">
                If you’ve got any questions, feedback or improvement ideas, we’ve created a
                subreddit (<a href="https://www.reddit.com/r/beam_me/">r/beam_me</a>), where you can
                tell us about it.
            </p>

            <div className="grid-container-footer">
                <div className="grid-1-footer">
                    <p>
                        <a href="https://usebeam.chat/privacy-policy">Privacy Policy</a>
                    </p>
                </div>

                <div className="grid-2-footer">
                    <p>
                        <a href="https://usebeam.chat/terms-and-condition">Terms of Use</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
