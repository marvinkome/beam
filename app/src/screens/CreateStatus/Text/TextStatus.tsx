import React from "react"
import { StyleSheet, View, TextInput, StatusBar } from "react-native"
import { darken } from "libs/helpers"
import { theme } from "styles/theme"
import { FooterActions } from "./FooterActions"

type IProps = {
    text: string
    bgColor: string
    font: string
    onChange: (key: "text" | "bgColor" | "font", value: string) => void
}

export function TextStatusScreen(props: IProps) {
    return (
        <>
            <StatusBar backgroundColor={darken(props.bgColor, 20)} barStyle="light-content" />
            <View style={[styles.container, { backgroundColor: props.bgColor }]}>
                <TextInput
                    style={[styles.text, { fontFamily: props.font }]}
                    selectionColor={theme.colors?.black + "af"}
                    underlineColorAndroid="transparent"
                    placeholderTextColor={theme.colors?.black + "af"}
                    multiline={true}
                    placeholder="Type a status"
                    value={props.text}
                    onChangeText={(text) => props.onChange("text", text)}
                />

                {/* footer */}
                <FooterActions text={props.text} font={props.font} onChange={props.onChange} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
    },

    text: {
        height: "90%",
        fontSize: 35,
        textAlign: "center",
        paddingHorizontal: 25,
        color: theme.colors?.black,
    },
})
