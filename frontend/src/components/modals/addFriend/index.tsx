import React, { useState, useRef } from "react"
import { trackModalView, trackEvent } from "lib/analytics"
import { FaFacebookMessenger, FaWhatsapp, FaTwitter } from "react-icons/fa"
import { Modal } from ".."
import { useQuery, gql, useMutation } from "@apollo/client"
import { shareUrl } from "lib/helpers"
import "./style.scss"

function useInviteLink() {
    const { data } = useQuery(gql`
        query Me {
            me {
                id
                profile {
                    firstName
                }
            }
        }
    `)

    const [getInviteLink] = useMutation(gql`
        mutation CreateInviteLink {
            createInviteLink
        }
    `)

    return {
        firstName: data?.me.profile.firstName,
        getInviteLink,
    }
}

type IProps = {
    trigger: (toggleFn: () => void) => JSX.Element
    modalLocation: string
}
export default function AddFriend(props: IProps) {
    let inviteLink = useRef("")
    const { firstName, getInviteLink } = useInviteLink()

    const [modalOpen, setModalState] = useState(false)
    const toggleModal = async () => {
        if (!modalOpen) {
            const { data } = await getInviteLink()
            inviteLink.current = data?.createInviteLink
            trackModalView(`add-friend-${props.modalLocation}`)
        }

        setModalState(!modalOpen)
    }

    const [copied, setCopied] = useState(false)
    const copyRef = useRef<HTMLInputElement>(null)
    const copyLink = () => {
        copyRef.current?.select()
        if (document.execCommand("copy")) {
            trackEvent("Invite friend through copy link", {
                category: "Invite",
                label: "onboarding",
            })
            setCopied(true)
        }
    }

    const { messenger, whatsapp, twitter } = shareUrl(inviteLink.current, firstName, true)

    return (
        <>
            {props.trigger(toggleModal)}

            <Modal isOpen={modalOpen} toggleModal={toggleModal} id="add-friend-modal">
                <div className="modal-header">
                    <p>Your Beam invite link has been generated</p>
                </div>

                <div className="modal-content">
                    <p>
                        Remember to only give invites to people you actually want to chat and share
                        things with.
                    </p>

                    <div className="invite-box">
                        <p>Invite a Beam friend through</p>

                        <div className="share-options">
                            <FaFacebookMessenger
                                onClick={() => {
                                    trackEvent("Invite friend through Messenger", {
                                        category: "Invite ",
                                    })
                                    window.open(messenger)
                                }}
                                className="icon messenger"
                            />

                            <FaWhatsapp
                                onClick={() => {
                                    trackEvent("Invite friend through WhatsApp", {
                                        category: "Invite ",
                                    })
                                    window.open(whatsapp)
                                }}
                                className="icon whatsapp"
                            />

                            <FaTwitter
                                onClick={() => {
                                    trackEvent("Invite friend through Twitter", {
                                        category: "Invite ",
                                    })
                                    window.open(twitter)
                                }}
                                className="icon twitter"
                            />
                        </div>

                        <p>or copy link</p>

                        <div className="copy-link">
                            <input ref={copyRef} defaultValue={inviteLink.current} readOnly />
                            <span onClick={copyLink}>{copied ? "Copied!" : "Copy link"}</span>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
