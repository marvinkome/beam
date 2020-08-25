import React, { useState, useEffect, useCallback } from "react"
import { ChatUi } from "components/chat"
import { useParams } from "react-router-dom"
import { useQuery, gql, useMutation, useSubscription } from "@apollo/client"
import { getProfileImage } from "lib/helpers"
import sortBy from "lodash.sortby"
import { trackError } from "lib/GA"

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
        { variables: { groupId, first: 30 } }
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

export function GroupChat() {
    const { data } = useGroupData()
    const { messages, sendMessage } = useMessages(data)

    return (
        <div className="group-chat">
            <ChatUi
                chatType="group"
                isPreviewing={!data?.group?.isMember}
                description=""
                profile={{
                    name: data?.group?.name,
                    image: data?.group?.image,
                }}
                messages={messages}
                sendMessage={sendMessage}
            />
        </div>
    )
}
