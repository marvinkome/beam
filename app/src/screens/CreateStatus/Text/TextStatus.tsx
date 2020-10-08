import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { FooterActions } from "./FooterActions"

export function TextStatusScreen() {
    return (
        <View style={styles.container}>
            <Text>Text status screen</Text>

            {/* footer */}
            <FooterActions />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
