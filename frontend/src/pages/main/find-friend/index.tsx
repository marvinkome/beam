import React, { useState, useRef } from "react"
import { StackHeader } from "components/header"
import { FaFacebookMessenger, FaWhatsapp, FaTwitter } from "react-icons/fa"
import { SuggestedFriendCard } from "components/suggestedFriendCard"
import { shareUrl } from "lib/helpers"
import { useHistory } from "react-router-dom"
import { useQuery, gql, useMutation } from "@apollo/client"
import { trackUserEvent } from "lib/GA"
import "./style.scss"

function useShare() {
    const [copied, setCopied] = useState(false)
    const copyRef = useRef<HTMLInputElement>(null)
    const copyLink = () => {
        copyRef.current?.select()
        if (document.execCommand("copy")) {
            trackUserEvent("Share Beam through copy link", "Find friend")
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

function useData() {
    const { data, loading } = useQuery(
        gql`
            {
                suggestedFriend {
                    friend {
                        id
                        profile {
                            firstName
                            picture
                            location {
                                city
                                state
                            }
                        }
                    }
                    sharedInterests {
                        name
                        platform
                    }
                }
            }
        `,
        {
            fetchPolicy: "network-only",
        }
    )

    return {
        data,
        loading,
    }
}

function useContinueToChat(suggestedFriend: any) {
    const history = useHistory()
    const [addFriend] = useMutation(gql`
        mutation AddFriend($friend: ID!) {
            addFriendById(friendId: $friend)
        }
    `)

    const onContinueToChat = async () => {
        if (!suggestedFriend?.friend) {
            // continue to chats
            return history.push("/app/chats")
        }

        const { data } = await addFriend({
            variables: {
                friend: suggestedFriend.friend.id,
            },
        })

        if (data.addFriendById) {
            // continue to chat with friend
            history.push(`/app/chat/${suggestedFriend.friend.id}`)
        }
    }

    return onContinueToChat
}

export function FindFriend() {
    const shareData = useShare()
    const { loading, data } = useData()
    const onContinueToChat = useContinueToChat(data?.suggestedFriend)

    if (loading) {
        return (
            <div className="find-friend">
                <div className="no-friends">
                    <h1>Please wait while we search for a match near your location</h1>

                    <div className="loader"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="find-friend">
            <StackHeader title="Find a friend" />

            {data?.suggestedFriend ? (
                <div className="has-friend">
                    <h2>We found someone you might vibe with</h2>

                    <div className="friends">
                        <SuggestedFriendCard suggestedFriend={data.suggestedFriend} />
                    </div>
                </div>
            ) : (
                <div className="no-friends">
                    <h2>Sorry, but there aren't enough people in your location</h2>

                    <p>Try again later</p>

                    <div className="share-box">
                        <div className="share-box-header">
                            <p>Want to get matched with someone faster?</p>
                        </div>

                        <div className="share-box-content">
                            <div className="invite-box">
                                <p>Help us spread the word about Beam</p>

                                <div className="share-options">
                                    <FaFacebookMessenger
                                        onClick={() => {
                                            trackUserEvent(
                                                "Share Beam through Messenger",
                                                "Find friend"
                                            )
                                            window.open(shareData.messenger)
                                        }}
                                        className="icon messenger"
                                    />
                                    <FaWhatsapp
                                        onClick={() => {
                                            trackUserEvent(
                                                "Share Beam through WhatsApp",
                                                "Find friend"
                                            )
                                            window.open(shareData.whatsapp)
                                        }}
                                        className="icon whatsapp"
                                    />
                                    <FaTwitter
                                        onClick={() => {
                                            trackUserEvent(
                                                "Share Beam through Twitter",
                                                "Find friend"
                                            )
                                            window.open(shareData.twitter)
                                        }}
                                        className="icon twitter"
                                    />
                                </div>

                                <p>OR</p>

                                <div className="copy-link">
                                    <input
                                        ref={shareData.copyRef}
                                        defaultValue="https://usebeam.chat"
                                        readOnly
                                    />
                                    <span onClick={shareData.copyLink}>
                                        {shareData.copied ? "Copied!" : "Copy link"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {data?.suggestedFriend && (
                <button onClick={onContinueToChat} className="btn btn-primary">
                    Continue to chat
                </button>
            )}
        </div>
    )
}
