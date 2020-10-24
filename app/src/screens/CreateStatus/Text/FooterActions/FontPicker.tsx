import React, { useRef } from "react"
import * as Animatable from "react-native-animatable"
import { StyleSheet, Dimensions } from "react-native"
import { Icon, Text } from "react-native-elements"
import fonts from "styles/fonts"
import { StatusFonts } from "libs/constants"

type IProps = {
    onChange: (font: string) => void
    close: () => void
}
export function FontPicker(props: IProps) {
    const view = useRef<any>(null)
    const onClose = () => {
        view?.current
            ?.animate({
                from: { translateX: 0 },
                to: { translateX: -Dimensions.get("window").width },
            })
            .then(props.close)
    }

    return (
        <Animatable.View ref={view} animation="slideInLeft" duration={200} style={styles.container}>
            <Icon name="close" type="ionicons" onPress={onClose} />

            <Text
                onPress={() => props.onChange(StatusFonts.font1)}
                style={[styles.fontItem, { fontFamily: StatusFonts.font1 }]}
            >
                T
            </Text>
            <Text
                onPress={() => props.onChange(StatusFonts.font2)}
                style={[styles.fontItem, { fontFamily: StatusFonts.font2 }]}
            >
                T
            </Text>
            <Text
                onPress={() => props.onChange(StatusFonts.font3)}
                style={[styles.fontItem, { fontFamily: StatusFonts.font3 }]}
            >
                T
            </Text>
            <Text
                onPress={() => props.onChange(StatusFonts.font4)}
                style={[styles.fontItem, { fontFamily: StatusFonts.font4 }]}
            >
                T
            </Text>
            <Text
                onPress={() => props.onChange(StatusFonts.font5)}
                style={[styles.fontItem, { fontFamily: StatusFonts.font5 }]}
            >
                T
            </Text>
        </Animatable.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
    },

    fontItem: {
        fontSize: 35,
    },
})
