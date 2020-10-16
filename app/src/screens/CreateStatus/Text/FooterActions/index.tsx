import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { Button, Icon, Text } from "react-native-elements"
import { TouchableOpacity } from "react-native-gesture-handler"
import fonts from "styles/fonts"
import { theme } from "styles/theme"

import { ColorPicker } from "./ColorPicker"
import { FontPicker } from "./FontPicker"

export function FooterActions() {
    const [currentActionView, setCurrentActionView] = useState<"color" | "font" | null>(null)

    return (
        <View style={styles.footer}>
            {currentActionView === "color" && (
                <ColorPicker close={() => setCurrentActionView(null)} />
            )}

            {currentActionView === "font" && (
                <FontPicker close={() => setCurrentActionView(null)} />
            )}

            {!currentActionView && (
                <>
                    <Icon
                        size={30}
                        name="format-color-fill"
                        containerStyle={{ marginTop: -10, marginRight: 40 }}
                        onPress={() => setCurrentActionView("color")}
                    />

                    <TouchableOpacity onPress={() => setCurrentActionView("font")}>
                        <View style={{ marginTop: -10 }}>
                            <Text style={styles.textSelector}>T</Text>
                        </View>
                    </TouchableOpacity>

                    <Button
                        containerStyle={{ marginLeft: "auto" }}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.buttonTextStyle}
                        type="outline"
                        icon={{ name: "send", type: "ionicon", size: 18 }}
                        iconRight
                        title="Next"
                    />
                </>
            )}
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

    textSelector: {
        fontSize: 32,
        ...fonts.bold,
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
