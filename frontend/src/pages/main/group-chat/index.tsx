import React, { useState, useEffect, useCallback } from "react"
import sortBy from "lodash.sortby"
import { ChatUi } from "components/chat"
import { useParams, useHistory } from "react-router-dom"
import { useQuery, gql, useMutation, useSubscription } from "@apollo/client"
import { getProfileImage, pluralize } from "lib/helpers"
import { trackError } from "lib/analytics"
import { useJoinGroup, useLeaveGroup } from "hooks/groups"

type User = {
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
        sending: false,
    }))
}

function useGroupData() {
    const { groupId } = useParams()

    const resp = useQuery(
        gql`
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
        `,
        { fetchPolicy: "cache-and-network", variables: { groupId, first: 30 } }
    )

    return resp
}

function useSendMessageToServer() {
    const [sendMessageToServer] = useMutation(
        gql`
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
    )

    return sendMessageToServer
}

function useSubscibeToMessage(updateState: (data: any) => void) {
    const { groupId } = useParams()

    const { data, loading } = useSubscription(
        gql`
            subscription Messages($groupId: ID) {
                messageSent(groupId: $groupId) {
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
            variables: { groupId },
        }
    )

    useEffect(() => {
        if (!loading && data) {
            updateState(data.messageSent)
        }
    }, [loading, data, updateState])
}

function useMessages(queryData: any) {
    const { groupId } = useParams()

    // FETCH MESSAGES
    const [messages, updateMessageState] = useState<any[]>([])
    useEffect(() => {
        if (queryData) {
            const messages = formatMessages(queryData.group.messages, queryData.me.id)
            updateMessageState(sortBy(messages, ["timestamp"]))
        }
    }, [queryData])

    // SEND MESSAGE
    const sendMessageToServer = useSendMessageToServer()
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        const messageTarget = (e.target as any)["message"]

        // validate messages
        const messageText = messageTarget.value.trim()
        if (!messageText.length) return

        // Send message to server
        const { data } = await sendMessageToServer({
            variables: { message: messageText, groupId },
        })

        if (!data?.sendMessageToGroup.success) {
            console.log("error", data?.sendMessageToGroup.message)
            trackError(`${data?.sendMessageToGroup.message} in Group Chat`)
            return
        }

        // update state with new data
        updateMessageState(
            messages.concat(
                ...formatMessages([data?.sendMessageToGroup.sentMessage], queryData.me.id)
            )
        )

        messageTarget.value = ""
    }

    // LISTEN FOR NEW MESSAGE
    const messageCb = useCallback(
        (message: any) => {
            const formattedMessage = formatMessages([message], queryData.me.id)
            updateMessageState((oldMessages) => oldMessages.concat(...formattedMessage))
        },
        [queryData]
    )

    useSubscibeToMessage(messageCb)

    return {
        messages,
        sendMessage,
    }
}

function useMembership(defaultIsMember: boolean) {
    const [isMember, setMembership] = useState(defaultIsMember)
    const joinGroup = useJoinGroup(() => {
        setMembership(true)
    })

    useEffect(() => {
        if (defaultIsMember) {
            setMembership(true)
        }
    }, [defaultIsMember])

    return {
        isMember,
        joinGroup,
    }
}

export function GroupChat() {
    const history = useHistory()
    const { data, loading } = useGroupData()
    const { messages, sendMessage } = useMessages(data)
    const { isMember, joinGroup } = useMembership(data?.group?.isMember)
    const leaveGroup = useLeaveGroup(() => {
        return history.push("/app/chats")
    })

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
