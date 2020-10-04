import React from "react"
import { Text, StyleSheet, Linking, Pressable } from "react-native"
import { theme } from "styles/theme"

type IProps = {
    children: string
    href: string
    style?: any
}
export function TextLink(props: IProps) {
    const onPress = async () => {
        await Linking.openURL(props.href)
    }

    return (
        <Pressable onPress={onPress}>
            <Text style={[styles.textStyle, props.style]}>{props.children}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    textStyle: {
        color: theme.colors?.primary,
    },
})
