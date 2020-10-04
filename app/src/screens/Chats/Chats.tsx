import React from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { Button } from "react-native-elements"
import { ChatsHeader } from "./Header"
import { ChatItem } from "./Item"

export const data = [
    {
        id: "0",
        name: "Robert",
        message: { text: "I think we should link up and play battlefield", isDefault: false },
        timestamp: "10:40 am",
        unreadCount: 3,
        image: require("assets/images/me.jpeg"),
    },
]

export function ChatsScreen() {
    return (
        <View style={style.container}>
            <ChatsHeader />

            {/* list */}
            <FlatList
                data={data}
                keyExtractor={(item: typeof data[any]) => item.id}
                renderItem={({ item }) => <ChatItem item={item} />}
                showsVerticalScrollIndicator={false}
            />

            {/* invite friend */}
            {data.length < 2 && (
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
