import React from "react"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, View } from "react-native"
import { Icon, Image, Text } from "react-native-elements"
import fonts from "styles/fonts"
import { theme } from "styles/theme"

export function ChatHeader() {
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <Icon
                size={30}
                name="arrow-left"
                type="feather"
                onPress={navigation.goBack}
                containerStyle={{ marginRight: 20 }}
            />

            <Image style={styles.image} source={require("assets/images/me.jpeg")} />

            <View>
                <Text style={styles.nameStyle}>Girozaki</Text>
                <Text style={styles.lastSeenStyle}>Last seen yesterday at 12:00 am</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: theme.colors?.grey3,
    },

    image: {
        width: 45,
        height: 45,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: theme.colors?.purple4,
        marginRight: 15,
    },

    nameStyle: {
        ...fonts.semiBold,
        fontSize: 18,
    },

    lastSeenStyle: {
        fontSize: 14,
    },
})
