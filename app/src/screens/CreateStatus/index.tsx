import React from "react"
import { StyleSheet, View } from "react-native"
import { Icon } from "react-native-elements"
import { TextStatus } from "./Text"

export function CreateStatus() {
    return (
        <View style={{ flex: 1 }}>
            <Icon containerStyle={styles.closeIconContainer} name="close" type="ionicons" />

            <TextStatus />
        </View>
    )
}

const styles = StyleSheet.create({
    closeIconContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 25,
    },
})
