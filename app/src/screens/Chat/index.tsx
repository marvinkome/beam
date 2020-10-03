import React from "react"
import { useNavigation } from "@react-navigation/native"
import { View, Text } from "react-native"
import { Button } from "react-native-elements"

export function Chat() {
    const nav = useNavigation()

    return (
        <View>
            <Text>Chat page</Text>

            <Button title="Go to profile" onPress={() => nav.navigate("Profile")} />
        </View>
    )
}
