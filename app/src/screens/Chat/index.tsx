import React, { useEffect, useState } from "react"
import Toast from "react-native-toast-message"
import { sortBy } from "lodash"
import { gql, useMutation, useQuery } from "@apollo/client"
import { ChatScreen } from "./Chat"
import { formatMessages, createClientResponse } from "./helpers"
import { formatDate } from "libs/helpers"
import { Loader } from "components"

const friendId = "5f5d421b58b04d336e4846ef"

const DATA_QUERY = gql`
    query GetFriendProfileAndChats($friendId: ID!, $first: Int) {
        me {
            id
        }

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

const SEND_MESSAGE = gql`
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

const MESSAGE_SUBSCRIPTION = gql`
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

const LAST_SEEN_SUBSCRIPTION = gql`
    subscription LastSeen($friendId: ID!) {
        lastSeen(friendId: $friendId)
    }
`

function useDataQuery() {
    const resp = useQuery(DATA_QUERY, {
        fetchPolicy: "cache-and-network",
        variables: { friendId, first: 30 },
        onError: () => {
            // do nothing
        },
    })

    return resp
}

function useSendMessage() {
    const [sendMessageToServer] = useMutation(SEND_MESSAGE)

    return async (message: string, friendId: string, userId: string) => {
        // create optimistic response
        const optimisticResponse = createClientResponse(message, userId)

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
                Toast.show({ type: "error", text1: "Error sending message", position: "bottom" })

                // TODO: Sentry.captureMessage(data.sendMessage.message)
                return
            }

            return data.sendMessage.sentMessage
        } catch (e) {
            // TODO: handle offline messaging

            Toast.show({ type: "error", text1: "Error sending message", position: "bottom" })

            // TODO: sentry
            return
        }
    }
}

function useViewPage() {
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

function useMessages(data: any, subscribeToMore: any) {
    const messages = sortBy(formatMessages(data?.conversation?.messages || []), ["timestamp"])

    useEffect(() => {
        if (subscribeToMore) {
            subscribeToMore({
                document: MESSAGE_SUBSCRIPTION,
                variables: { friendId },
                updateQuery: (data: any, { subscriptionData }: any) => {
                    if (!subscriptionData.data) return data

                    const newMessage = subscriptionData.data.messageSent

                    // update conversation profile
                    return {
                        ...data,
                        conversation: {
                            ...(data.conversation || {}),
                            messages: [newMessage, ...(data.conversation?.messages || [])],
                        },
                    }
                },
            })
        }
    }, [friendId, subscribeToMore])

    const sendMessageToServer = useSendMessage()
    const sendMessage = async (messageText: string) => {
        // validate messages
        messageText = messageText.trim()
        if (!messageText.length) return

        // Send message to server
        const sentMessage = await sendMessageToServer(messageText, friendId, data?.me?.id)
        if (!sentMessage) return
    }

    return {
        messages,
        sendMessage,
    }
}

function useProfile(data: any, subscribeToMore: any) {
    const friend = data?.friend

    // subscribe to last seen changes
    useEffect(() => {
        if (subscribeToMore) {
            subscribeToMore({
                document: LAST_SEEN_SUBSCRIPTION,
                variables: { friendId },
                updateQuery: (data: any, { subscriptionData }: any) => {
                    if (!subscriptionData.data) return data

                    const newLastSeen = subscriptionData.data.lastSeen

                    // update friend profile
                    return { ...data, friend: { ...data.friend, lastSeen: newLastSeen } }
                },
            })
        }
    }, [friendId, subscribeToMore])

    return {
        ...friend?.profile,
        isBot: friend?.bot,
        lastSeen:
            friend?.lastSeen === null
                ? "Online"
                : `Last seen ${formatDate(friend?.lastSeen, true)}`,
    }
}

export function Chat() {
    const { data, loading, subscribeToMore } = useDataQuery()
    const { messages, sendMessage } = useMessages(data, subscribeToMore)
    const profile = useProfile(data, subscribeToMore)
    useViewPage()

    if (loading && !data) {
        return <Loader />
    }

    return (
        <ChatScreen
            userId={data?.me?.id}
            profile={profile}
            messages={messages}
            sendMessage={sendMessage}
        />
    )
}
