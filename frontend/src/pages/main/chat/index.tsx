import React, { useEffect } from "react"
import _sortBy from "lodash.sortby"
import { useQuery, gql, useMutation } from "@apollo/client"
import { useParams } from "react-router-dom"
import { formatDate, getProfileImage } from "lib/helpers"
import { ChatUi } from "components/chat"
import { toast } from "react-toastify"
import { trackError } from "lib/analytics"

/* === GQL DOCS === */
const DATA_QUERY = gql`
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

        conversation(with: $friendId) {
            id
            messages(first: $first) {
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
    }
`

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
    timestamp: number
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
        sending: message.id === null,
    }))
}

/* === API Calls === */
function useDataQuery() {
    const { friendId } = useParams()

    // Get friend's profile and conversation with friend
    const resp = useQuery(DATA_QUERY, {
        variables: { friendId, first: 30 },
    })

    return resp
}

function useSendMessageToServer() {
    const DOC = gql`
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

    const [sendMessageToServer] = useMutation(DOC)

    return async (message: string, friendId: string) => {
        // create optimistic response
        const optimisticResponse = {
            sendMessage: {
                code: "200",
                success: true,
                sentMessage: {
                    __typename: "Message",
                    id: null,
                    message,
                    timestamp: Date.now(),
                    from: {
                        id: "0",
                        __typename: "User",
                        profile: {
                            // not needed as it's not shown
                            firstName: "",
                            picture: "",
                            __typename: "Profile",
                        },
                    },
                },
            },
        }

        // update cache with new data
        try {
            const { data } = await sendMessageToServer({
                variables: { message, friendId },
                optimisticResponse,
                update: (cache, resp) => {
                    const data = cache.readQuery<any>({
                        variables: { friendId, first: 30 },
                        query: DATA_QUERY,
                    })

                    const newMessage = {
                        __typename: "Message",
                        ...resp.data.sendMessage.sentMessage,
                    }

                    cache.writeQuery({
                        query: DATA_QUERY,
                        variables: { friendId, first: 30 },
                        data: {
                            ...data,
                            conversation: {
                                ...data.conversation,
                                messages: [newMessage, ...data.conversation.messages],
                            },
                        },
                    })
                },
            })

            if (!data.sendMessage.success) {
                toast.dark("Error sending message")
                trackError(data.sendMessage.message)
                return
            }

            return data.sendMessage.sentMessage
        } catch (e) {
            toast.dark("Error sending message. Check your network connection")
            return
        }
    }
}

function useViewPage() {
    const { friendId } = useParams()
    const [setViewConversation] = useMutation(gql`
        mutation SetViewConversation($friendId: ID!, $viewing: Boolean) {
            setViewConversation(viewing: $viewing, id: $friendId)
        }
    `)

    useEffect(() => {
        setViewConversation({ variables: { friendId, viewing: true } })

        return () => {
            setViewConversation({ variables: { friendId, viewing: false } })
        }
    }, [friendId, setViewConversation])
}

/* === Data management === */
function useMessages(data: any, subscribeToMore: any) {
    const { friendId } = useParams()
    const messages = _sortBy(formatMessages(data?.conversation?.messages || [], friendId), [
        "timestamp",
    ])

    // subscribe to new messages
    useEffect(() => {
        const MESSAGE_SUB = gql`
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
        `

        subscribeToMore({
            document: MESSAGE_SUB,
            variables: { friendId },
            updateQuery: (data: any, { subscriptionData }: any) => {
                if (!subscriptionData.data) return data

                const newMessage = subscriptionData.data.messageSent

                // update conversation profile
                return {
                    ...data,
                    conversation: {
                        ...data.conversation,
                        messages: [newMessage, ...data.conversation.messages],
                    },
                }
            },
        })
    }, [friendId, subscribeToMore])

    const sendMessageToServer = useSendMessageToServer()
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        const messageTarget = (e.target as any)["message"]

        // validate messages
        const messageText = messageTarget.value.trim()
        if (!messageText.length) return

        // clear message
        messageTarget.value = ""

        // Send message to server
        const sentMessage = await sendMessageToServer(messageText, friendId)
        if (!sentMessage) return
    }

    return {
        messages,
        sendMessage,
    }
}

function useProfile(data: any, subscribeToMore: any) {
    const { friendId } = useParams()
    const friend = data?.friend

    // subscribe to last seen changes
    useEffect(() => {
        const LAST_SEEN_SUB = gql`
            subscription LastSeen($friendId: ID!) {
                lastSeen(friendId: $friendId)
            }
        `

        subscribeToMore({
            document: LAST_SEEN_SUB,
            variables: { friendId },
            updateQuery: (data: any, { subscriptionData }: any) => {
                if (!subscriptionData.data) return data

                const newLastSeen = subscriptionData.data.lastSeen

                // update friend profile
                return { ...data, friend: { ...data.friend, lastSeen: newLastSeen } }
            },
        })
    }, [friendId, subscribeToMore])

    return {
        ...friend?.profile,
        isBot: friend?.bot,
        lastSeen:
            friend?.lastSeen === null
                ? "Online"
                : `Last seen ${formatDate(parseInt(friend?.lastSeen, 10), true)}`,
    }
}

// MAIN COMPONENT
export function Chat() {
    const { data, loading, subscribeToMore } = useDataQuery()
    const { messages, sendMessage } = useMessages(data, subscribeToMore)
    const profile = useProfile(data, subscribeToMore)
    useViewPage()

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
                defaultMessage={
                    !!profile
                        ? `This is the beginning of your conversations with ${profile?.firstName}. Say hello.`
                        : ""
                }
                isLoading={loading && !data}
            />
        </div>
    )
}
