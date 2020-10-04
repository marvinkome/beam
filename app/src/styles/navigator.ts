import { StyleSheet } from "react-native"
import { theme } from "./theme"

export const navigationStyle = StyleSheet.create({
    tabBar: {
        backgroundColor: theme.colors?.background,
        borderTopColor: theme.colors?.grey3,
        height: 75,
    },

    createStatusIconContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors?.primary,
        width: 65,
        height: 65,
        borderRadius: 50,
        borderWidth: 5,
        borderColor: "#4A3C70",
    },
})
