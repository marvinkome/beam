import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { GiftedChat } from "react-native-gifted-chat"
import { ChatHeader } from "./Header"
import { ChatInput } from "./Input"
import { ChatBubble } from "./Bubble"

// const messages = [
//     {
//         _id: 0,
//         text: "I'm the book nerd",
//         createdAt: new Date(Date.UTC(2020, 9, 3, 9, 2, 0)),
//         user: {
//             _id: 0,
//             name: "Marvin",
//         },
//     },
//     {
//         _id: 1,
//         text: "Have you heard from John, haven't seen that dude in a while. Kinda miss his humour",
//         createdAt: new Date(Date.UTC(2020, 9, 3, 17, 2, 0)),
//         user: {
//             _id: 1,
//             name: "Girozaki",
//         },
//     },
//     {
//         _id: 2,
//         text: "Nah man I haven't heard anything from John",
//         createdAt: new Date(Date.UTC(2020, 9, 3, 9, 2, 0)),
//         user: {
//             _id: 0,
//             name: "Marvin",
//         },
//     },
//     {
//         _id: 25,
//         text: "I should call him",
//         createdAt: new Date(Date.UTC(2020, 9, 3, 9, 2, 0)),
//         user: {
//             _id: 0,
//             name: "Marvin",
//         },
//     },
//     {
//         _id: 3,
//         text: "We should check up on him",
//         createdAt: new Date(Date.UTC(2020, 9, 3, 10, 2, 0)),
//         user: {
//             _id: 1,
//             name: "Girozaki",
//         },
//     },
//     {
//         _id: 4,
//         text: "I'm leaving home now. Let's meet",
//         createdAt: new Date(Date.UTC(2020, 9, 3, 15, 2, 0)),
//         user: {
//             _id: 1,
//             name: "Girozaki",
//         },
//     },
//     {
//         _id: 45,
//         text: "Ok. Getting ready now",
//         createdAt: new Date(Date.UTC(2020, 9, 3, 15, 2, 0)),
//         pending: true,
//         user: {
//             _id: 0,
//             name: "Marvin",
//         },
//     },
// ]

type IProps = {
    profile: any
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
export function ChatScreen({ profile, messages }: IProps) {
    return (
        <View style={styles.container}>
            <ChatHeader
                picture={profile?.picture}
                name={profile.firstName}
                lastSeen={profile.lastSeen}
            />

            <GiftedChat
                messages={messages}
                inverted={false}
                alwaysShowSend={true}
                placeholder="Type a message"
                user={{ _id: 0 }}
                renderBubble={(props) => <ChatBubble {...props} />}
                renderInputToolbar={(props) => <ChatInput {...props} />}
                // @ts-ignore
                renderAvatar={null}
            />

            {/* send button */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
