import React from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { Button } from "react-native-elements"
import { ChatsHeader } from "./Header"
import { ChatItem } from "./Item"

type IProps = {
    profile: {
        picture: string
    }
    friends: Array<{
        id: string
        name: string
        timestamp: string
        image: string
        unreadCount: number
        message: {
            text: string
        }
    }>
}

export function ChatsScreen({ friends, profile }: IProps) {
    return (
        <View style={style.container}>
            <ChatsHeader picture={profile.picture} />

            {/* list */}
            <FlatList
                data={friends}
                keyExtractor={(item: IProps["friends"][any]) => item.id}
                renderItem={({ item }) => <ChatItem item={item} />}
                showsVerticalScrollIndicator={false}
            />

            {/* invite friend */}
            {friends.length < 2 && (
                <View style={style.bottomContainer}>
                    <Button onPress={() => null} title="Invite your friends to Beam" />
                </View>
            )}
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
    },

    bottomContainer: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
})
