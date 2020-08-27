import React, { useState, useRef, useEffect } from "react"
import { FaFacebookMessenger, FaWhatsapp, FaTwitter } from "react-icons/fa"
import { Modal } from ".."
import { shareUrl } from "lib/helpers"
import { trackModalView, trackEvent } from "lib/analytics"
import "./style.scss"

type IProps = {
    trigger: (toggleFn: () => void) => JSX.Element
    modalLocation: string
}
export default function ShareBeam(props: IProps) {
    const [modalOpen, setModalState] = useState(false)
    const toggleModal = () => setModalState(!modalOpen)

    useEffect(() => {
        if (modalOpen) {
            trackModalView(`share-beam-${props.modalLocation}`)
        }
    }, [modalOpen, props.modalLocation])

    const [copied, setCopied] = useState(false)
    const copyRef = useRef<HTMLInputElement>(null)
    const copyLink = () => {
        copyRef.current?.select()
        if (document.execCommand("copy")) {
            trackEvent("Share beam through copy link", { category: "Share" })
            setCopied(true)
        }
    }

    const { messenger, whatsapp, twitter } = shareUrl("https://usebeam.chat")

    return (
        <>
            {props.trigger(toggleModal)}

            <Modal isOpen={modalOpen} toggleModal={toggleModal} id="share-beam-modal">
                <div className="modal-header">
                    <p>Thanks for helping spread the word about Beam</p>
                </div>

                <div className="modal-content">
                    <div className="invite-box">
                        <p>Click on any of these to tell people</p>

                        <div className="share-options">
                            <FaFacebookMessenger
                                onClick={() => {
                                    trackEvent("Share beam through Messenger", {
                                        category: "Share",
                                    })
                                    window.open(messenger)
                                }}
                                className="icon messenger"
                            />
                            <FaWhatsapp
                                onClick={() => {
                                    trackEvent("Share beam through WhatsApp", { category: "Share" })
                                    window.open(whatsapp)
                                }}
                                className="icon whatsapp"
                            />
                            <FaTwitter
                                onClick={() => {
                                    trackEvent("Share beam through Twitter", { category: "Share" })
                                    window.open(twitter)
                                }}
                                className="icon twitter"
                            />
                        </div>

                        <p>OR</p>

                        <div className="copy-link">
                            <input ref={copyRef} defaultValue="https://usebeam.chat" readOnly />
                            <span onClick={copyLink}>{copied ? "Copied!" : "Copy link"}</span>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
