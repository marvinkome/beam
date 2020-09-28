import React from "react"
import { StyleSheet } from "react-native"
import { Text } from "react-native-elements"
import { theme } from "styles/theme"

type IProps = {
    children: string
    style?: any
}
export function TextButton(props: IProps) {
    return <Text style={[styles.textStyle, props.style]}>{props.children}</Text>
}

const styles = StyleSheet.create({
    textStyle: {
        color: theme.colors?.primary,
    },
})
