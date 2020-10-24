import React from "react"
import { Pressable, StyleSheet } from "react-native"
import { Text } from "react-native-elements"
import { theme } from "styles/theme"

type IProps = {
    children: string
    onPress: () => void
    style?: any
}
export function TextButton(props: IProps) {
    return (
        <Pressable onPress={props.onPress}>
            <Text style={[styles.textStyle, props.style]}>{props.children}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    textStyle: {
        color: theme.colors?.primary,
    },
})
