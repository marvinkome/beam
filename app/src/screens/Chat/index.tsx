import React, { useEffect } from "react"
import { sortBy } from "lodash"
import { gql, useMutation, useQuery } from "@apollo/client"
import { ChatScreen } from "./Chat"
import { formatMessages } from "./helpers"
import { formatDate } from "libs/helpers"
import { Loader } from "components"

const friendId = "5f5d421b58b04d336e4846ef"

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
    })

    return resp
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
    }, [friendId, subscribeToMore])

    return {
        messages,
    }
}

function useProfile(data: any, subscribeToMore: any) {
    const friend = data?.friend

    // subscribe to last seen changes
    useEffect(() => {
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
    const { messages } = useMessages(data, subscribeToMore)
    const profile = useProfile(data, subscribeToMore)
    useViewPage()

    if (loading && !data) {
        return <Loader />
    }

    return <ChatScreen profile={profile} messages={messages} />
}
