import React, { useRef } from "react"
import * as Animatable from "react-native-animatable"
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { Icon } from "react-native-elements"
import { StatusColors } from "libs/constants"
import { theme } from "styles/theme"

type IProps = {
    onChange: (color: string) => void
    close: () => void
}
export function ColorPicker(props: IProps) {
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

            <TouchableOpacity onPress={() => props.onChange(StatusColors.color1)}>
                <View style={[styles.colorItem, { backgroundColor: StatusColors.color1 }]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.onChange(StatusColors.color2)}>
                <View style={[styles.colorItem, { backgroundColor: StatusColors.color2 }]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.onChange(StatusColors.color3)}>
                <View style={[styles.colorItem, { backgroundColor: StatusColors.color3 }]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.onChange(StatusColors.color4)}>
                <View style={[styles.colorItem, { backgroundColor: StatusColors.color4 }]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.onChange(StatusColors.color5)}>
                <View style={[styles.colorItem, { backgroundColor: StatusColors.color5 }]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.onChange(StatusColors.color6)}>
                <View style={[styles.colorItem, { backgroundColor: StatusColors.color6 }]} />
            </TouchableOpacity>
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

    colorItem: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: theme.colors?.black,
        // backgroundColor:
    },
})
