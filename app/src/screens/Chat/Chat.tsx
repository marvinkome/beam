import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { GiftedChat } from "react-native-gifted-chat"
import { ChatHeader } from "./Header"
import { ChatInput } from "./Input"
import { ChatBubble } from "./Bubble"

type IProps = {
    userId?: string
    profile: any
    sendMessage: (message: string) => void
    messages: Array<{
        _id: string
        text: string
        createdAt: Date
        pending: boolean
        user: {
            _id: string
            name: string
        }
    }>
}
export function ChatScreen({ profile, messages, sendMessage, ...props }: IProps) {
    return (
        <View style={styles.container}>
            <ChatHeader
                picture={profile?.picture}
                name={profile.firstName}
                lastSeen={profile.lastSeen}
            />

            <GiftedChat
                messages={messages}
                onSend={(message) => sendMessage(message[0].text)}
                alignTop={true}
                alwaysShowSend={true}
                placeholder="Type a message"
                user={{ _id: props.userId || "" }}
                renderBubble={(props) => <ChatBubble {...props} />}
                renderInputToolbar={(props) => <ChatInput {...props} />}
                minInputToolbarHeight={90}
                // @ts-ignore
                renderAvatar={null}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
