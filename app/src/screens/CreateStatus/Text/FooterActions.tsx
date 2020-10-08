import React from "react"
import { StyleSheet, View } from "react-native"
import { Button, Icon } from "react-native-elements"
import { theme } from "styles/theme"

export function FooterActions() {
    return (
        <View style={styles.footer}>
            <Icon
                size={30}
                name="format-color-fill"
                containerStyle={{ marginTop: -10, marginRight: 30 }}
            />
            <Icon size={30} name="text" type="ionicon" containerStyle={{ marginTop: -10 }} />

            <Button
                containerStyle={{ marginLeft: "auto" }}
                buttonStyle={styles.buttonStyle}
                titleStyle={styles.buttonTextStyle}
                type="outline"
                icon={{ name: "send", type: "ionicon", size: 18 }}
                iconRight
                title="Next"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 25,
        paddingVertical: 10,
    },

    buttonStyle: {
        width: 120,
        paddingVertical: 7,
        paddingHorizontal: 15,
        borderColor: theme.colors?.black,
        borderWidth: 2,
        justifyContent: "space-around",
    },

    buttonTextStyle: {
        color: theme.colors?.black,
    },
})
