import React from "react"
import { ActivityIndicator, View } from "react-native"
import { theme } from "styles/theme"

export function Loader() {
    return (
        <View
            style={{ backgroundColor: theme.colors?.background, flex: 1, justifyContent: "center" }}
        >
            <ActivityIndicator color={theme.colors?.primary} size="large" />
        </View>
    )
}
