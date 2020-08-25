import React, { useState, useEffect, useCallback } from "react"
import _sortBy from "lodash.sortby"
import { useQuery, gql, useMutation, useSubscription } from "@apollo/client"
import { useParams } from "react-router-dom"
import { formatDate, getProfileImage } from "lib/helpers"
import { ChatUi } from "components/chat"

/* === Types === */
type Friend = {
    id: string
    profile: {
        firstName: string
        picture: string
    }
}

type MessageResponse = {
    id: string
    timestamp: string
    message: string
    from: Friend
}

/* === Utils === */
function formatMessages(messages: MessageResponse[], friendId: string) {
    return messages.map((message) => ({
        id: message.from.id === friendId ? message.from.id : "0", // set my id to 0
        messageId: message.id,
        message: message.message,
        senderName: message.from.profile.firstName,
        senderImage: getProfileImage(message.from.profile),
        timestamp: message.timestamp,
        type: "friend",
        sending: false,
    }))
}

/* === Custom Hooks === */
function useDataFetch() {
    const { friendId } = useParams()

    // Get friend's profile and conversation with friend
    const resp = useQuery(
        gql`
            query GetFriendProfileAndChats($friendId: ID!, $first: Int) {
                friend(id: $friendId) {
                    id
                    lastSeen
                    bot
                    profile {
                        firstName
                        picture
                    }
                }

                conversation(with: $friendId, first: $first, sort: true) {
                    id
                    timestamp
                    message
                    from {
                        id
                        profile {
                            firstName
                            picture
                        }
                    }
                }
            }
        `,
        {
            fetchPolicy: "cache-and-network",
            variables: { friendId, first: 30 },
        }
    )

    return resp
}

function useSendMessageToServer() {
    const [sendMessageToServer] = useMutation(
        gql`
            mutation SendMessage($friendId: ID!, $message: String!) {
                sendMessage(to: $friendId, message: $message) {
                    code
                    success
                    sentMessage {
                        id
                        message
                        timestamp
                        from {
                            id
                            profile {
                                firstName
                                picture
                            }
                        }
                    }
                }
            }
        `
    )

    return [sendMessageToServer]
}

function useSubscibeToMessage(updateState: (data: any) => void) {
    const { friendId } = useParams()

    const { data, loading } = useSubscription(
        gql`
            subscription Messages($friendId: ID) {
                messageSent(friendId: $friendId) {
                    id
                    message
                    timestamp
                    from {
                        id
                        profile {
                            firstName
                            picture
                        }
                    }
                }
            }
        `,
        {
            variables: { friendId },
        }
    )

    useEffect(() => {
        if (!loading && data) {
            const message = formatMessages([data.messageSent], friendId)
            updateState(message)
        }
    }, [loading, data, updateState, friendId])
}

function useSubscribeToProfileLastSeen(updateState: (data: any) => void) {
    const { friendId } = useParams()

    const { data, loading } = useSubscription(
        gql`
            subscription LastSeen($friendId: ID!) {
                lastSeen(friendId: $friendId)
            }
        `,
        {
            variables: { friendId },
        }
    )

    useEffect(() => {
        if (!loading && data) {
            updateState(data.lastSeen)
        }
    }, [loading, data, updateState])
}

function useMessages(data: any) {
    const { friendId } = useParams()

    // FETCH MESSAGES
    const [messages, updateMessageState] = useState<any[]>([])
    useEffect(() => {
        if (data) {
            const messages = formatMessages(data.conversation, friendId)
            updateMessageState(_sortBy(messages, ["timestamp"]))
        }
    }, [data, friendId])

    // SEND MESSAGE
    const [sendMessageToServer] = useSendMessageToServer()
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        const messageTarget = (e.target as any)["message"]

        // validate messages
        const messageText = messageTarget.value.trim()
        if (!messageText.length) return

        // Send message to server
        const {
            data: { sendMessage },
        } = await sendMessageToServer({
            variables: { message: messageText, friendId },
        })

        if (!sendMessage.success) {
            console.log("error", data.message)
            return
        }

        // update state with new data
        updateMessageState(messages.concat(...formatMessages([sendMessage.sentMessage], friendId)))

        messageTarget.value = ""
    }

    // LISTEN FOR NEW MESSAGE
    const messageCb = useCallback((message: any) => {
        updateMessageState((oldMessages) => oldMessages.concat(...message))
    }, [])
    useSubscibeToMessage(messageCb)

    return {
        messages,
        sendMessage,
    }
}

function useProfile(data: any) {
    const [profile, updateProfile] = useState<any>(null)

    useEffect(() => {
        if (data) {
            const { friend } = data
            updateProfile({
                ...friend.profile,
                isBot: friend.bot,
                lastSeen:
                    friend.lastSeen === null
                        ? "Online"
                        : `Last seen ${formatDate(parseInt(friend.lastSeen, 10), true)}`,
            })
        }
    }, [data])

    const lastSeenCb = useCallback((lastSeen: any) => {
        updateProfile((oldProfile: any) => ({
            ...oldProfile,
            lastSeen:
                lastSeen === null
                    ? "Online"
                    : `Last seen ${formatDate(parseInt(lastSeen, 10), true)}`,
        }))
    }, [])
    useSubscribeToProfileLastSeen(lastSeenCb)

    return { profile }
}

// MAIN COMPONENT
export function Chat() {
    const { data } = useDataFetch()
    const { profile } = useProfile(data)
    const { messages, sendMessage } = useMessages(data)

    return (
        <div className="chat-page">
            <ChatUi
                description={profile?.lastSeen}
                profile={{
                    name: profile?.firstName,
                    image: getProfileImage(profile),
                }}
                messages={messages}
                sendMessage={sendMessage}
                isPreviewing={false}
            />
        </div>
    )
}
