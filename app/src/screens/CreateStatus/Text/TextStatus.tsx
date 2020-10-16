import React, { useState } from "react"
import { StyleSheet, View, TextInput } from "react-native"
import fonts from "styles/fonts"
import { theme } from "styles/theme"
import { FooterActions } from "./FooterActions"

export function TextStatusScreen() {
    const [value, setValue] = useState("")

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.text}
                selectionColor={theme.colors?.black}
                underlineColorAndroid="transparent"
                placeholderTextColor={theme.colors?.black + "af"}
                multiline={true}
                placeholder="What's on your mind"
                value={value}
                onChangeText={(text) => setValue(text)}
            />

            {/* footer */}
            <FooterActions />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },

    text: {
        height: "90%",
        fontSize: 30,
        textAlign: "center",
        paddingHorizontal: 25,
        color: theme.colors?.black,
        ...fonts.regular,
    },
})
