import React from "react"
import { Text, StyleSheet, Linking } from "react-native"
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
        <Text onPress={onPress} style={[styles.textStyle, props.style]}>
            {props.children}
        </Text>
    )
}

const styles = StyleSheet.create({
    textStyle: {
        color: theme.colors?.primary,
    },
})
