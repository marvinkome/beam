import React, { useState, useRef } from "react"
import { FaFacebookMessenger, FaWhatsapp, FaTwitter } from "react-icons/fa"
import { shareUrl } from "lib/helpers"
import { trackEvent } from "lib/analytics"
import "./style.scss"

function useShare() {
    const [copied, setCopied] = useState(false)
    const copyRef = useRef<HTMLInputElement>(null)

    const copyLink = () => {
        copyRef.current?.select()
        if (document.execCommand("copy")) {
            trackEvent("Share Beam through copy link", { category: "Share", label: "Find friend" })
            setCopied(true)
        }
    }

    const { messenger, whatsapp, twitter } = shareUrl("https://usebeam.chat")

    return {
        messenger,
        whatsapp,
        twitter,
        copyLink,
        copied,
        copyRef,
    }
}

type IProps = {
    children: string
}
export function ShareBox(props: IProps) {
    const data = useShare()

    return (
        <div className="invite-box">
            <p>{props.children}</p>

            <div className="share-options">
                <FaFacebookMessenger
                    onClick={() => {
                        trackEvent("Share beam through Messenger", { category: "Share" })
                        window.open(data.messenger)
                    }}
                    className="icon messenger"
                />
                <FaWhatsapp
                    onClick={() => {
                        trackEvent("Share beam through WhatsApp", { category: "Share" })
                        window.open(data.whatsapp)
                    }}
                    className="icon whatsapp"
                />
                <FaTwitter
                    onClick={() => {
                        trackEvent("Share beam through Twitter", { category: "Share" })
                        window.open(data.twitter)
                    }}
                    className="icon twitter"
                />
            </div>

            <p>OR</p>

            <div className="copy-link">
                <input ref={data.copyRef} defaultValue="https://usebeam.chat" readOnly />
                <span onClick={data.copyLink}>{data.copied ? "Copied!" : "Copy link"}</span>
            </div>
        </div>
    )
}
