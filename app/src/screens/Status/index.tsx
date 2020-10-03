import React from "react"
import { View, Text } from "react-native"
import { Button } from "react-native-elements"
import { useNavigation } from "@react-navigation/native"

export function Status() {
    const nav = useNavigation()

    return (
        <View>
            <Text>Status page</Text>

            <Button title="Go to chat" onPress={() => nav.navigate("Chat")} />
            <Button title="Go to profile" onPress={() => nav.navigate("Profile")} />
        </View>
    )
}
