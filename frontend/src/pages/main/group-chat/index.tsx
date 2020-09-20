import * as Sentry from "@sentry/react"
import React, { useState, useEffect } from "react"
import sortBy from "lodash.sortby"
import { ChatUi } from "components/chat"
import { useParams, useHistory } from "react-router-dom"
import { useQuery, gql, useMutation } from "@apollo/client"
import { getProfileImage, pluralize } from "lib/helpers"
import { useJoinGroup, useLeaveGroup } from "hooks/groups"
import { toast } from "react-toastify"

/* === GQL DOCS === */
const GROUP_DATA_QUERY = gql`
    query GetGroup($groupId: ID!, $first: Int) {
        me {
            id
        }

        group(id: $groupId) {
            id
            name
            image
            isMember
            numberOfUsers
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

type User = {
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
    from: User
}

function formatMessages(messages: MessageResponse[], myId: string) {
    return messages.map((message) => ({
        id: message.from.id === myId ? "0" : message.from.id, // set my id to 0
        messageId: message.id,
        message: message.message,
        senderName: message.from.profile.firstName,
        senderImage: getProfileImage(message.from.profile),
        timestamp: message.timestamp,
        type: "group",
        sending: message.id === null,
    }))
}

function useDataQuery() {
    const { groupId } = useParams()

    const resp = useQuery(GROUP_DATA_QUERY, {
        variables: { groupId, first: 30 },
    })

    return resp
}

function useSendMessageToServer() {
    const DOC = gql`
        mutation SendMessage($groupId: ID!, $message: String!) {
            sendMessageToGroup(to: $groupId, message: $message) {
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

    return async (message: string, groupId: string) => {
        // create optimistic response
        const optimisticResponse = {
            sendMessageToGroup: {
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
                variables: { message, groupId },
                optimisticResponse,
                update: (cache, resp) => {
                    const data = cache.readQuery<any>({
                        variables: { groupId, first: 30 },
                        query: GROUP_DATA_QUERY,
                    })

                    const newMessage = {
                        __typename: "Message",
                        ...resp.data.sendMessageToGroup.sentMessage,
                    }

                    cache.writeQuery({
                        query: GROUP_DATA_QUERY,
                        variables: { groupId, first: 30 },
                        data: {
                            ...data,
                            group: {
                                ...data.group,
                                messages: [newMessage, ...data.group.messages],
                            },
                        },
                    })
                },
            })

            if (!data.sendMessageToGroup.success) {
                toast.dark("Error sending message")
                Sentry.captureMessage(data.sendMessageToGroup.message)
                return
            }

            return data.sendMessageToGroup.sentMessage
        } catch (e) {
            console.log(e)
            toast.dark("Error sending message. Check your network connection")
            return
        }
    }
}

function useMessages(data: any, subscribeToMore: any) {
    const { groupId } = useParams()
    const messages = sortBy(formatMessages(data?.group.messages || [], data?.me.id), ["timestamp"])

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
            variables: { groupId },
            updateQuery: (data: any, { subscriptionData }: any) => {
                if (!subscriptionData.data) return data

                const newMessage = subscriptionData.data.messageSent

                // update conversation profile
                return {
                    ...data,
                    group: {
                        messages: [newMessage, ...data.group.messages],
                    },
                }
            },
        })
    }, [groupId, subscribeToMore])

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
        const sentMessage = await sendMessageToServer(messageText, groupId)
        if (!sentMessage) return
    }

    return {
        messages,
        sendMessage,
    }
}

function useMembership(defaultIsMember: boolean) {
    const history = useHistory()
    const [isMember, setMembership] = useState(defaultIsMember)
    const joinGroup = useJoinGroup(() => {
        setMembership(true)
    })
    const leaveGroup = useLeaveGroup(() => history.push("/app/chats"))

    useEffect(() => {
        if (defaultIsMember) {
            setMembership(true)
        }
    }, [defaultIsMember])

    return {
        isMember,
        joinGroup,
        leaveGroup,
    }
}

function useViewPage() {
    const { groupId } = useParams()
    const [setViewGroup] = useMutation(gql`
        mutation SetViewGroup($groupId: ID!, $viewing: Boolean) {
            setViewGroup(viewing: $viewing, id: $groupId)
        }
    `)

    useEffect(() => {
        setViewGroup({ variables: { groupId, viewing: true } })

        return () => {
            setViewGroup({ variables: { groupId, viewing: false } })
        }
    }, [groupId, setViewGroup])
}

export function GroupChat() {
    const { data, loading, subscribeToMore } = useDataQuery()
    const { isMember, joinGroup, leaveGroup } = useMembership(data?.group?.isMember)

    const { messages, sendMessage } = useMessages(data, subscribeToMore)
    useViewPage()

    return (
        <div className="group-chat">
            <ChatUi
                isPreviewing={!isMember}
                description={
                    !isMember
                        ? "You're previewing this group"
                        : `${data?.group?.numberOfUsers} ${pluralize(
                              data?.group?.numberOfUsers || 0,
                              "member",
                              "members"
                          )}`
                }
                profile={{
                    name: data?.group?.name,
                    image: data?.group?.image,
                }}
                messages={messages}
                sendMessage={sendMessage}
                joinGroup={() => joinGroup(data?.group.id)}
                actions={[{ title: "Leave group", action: () => leaveGroup(data?.group.id) }]}
                defaultMessage={
                    !!data ? `This is the beginning of the ${data?.group?.name} group.` : ""
                }
                isLoading={loading && !data}
            />
        </div>
    )
}
