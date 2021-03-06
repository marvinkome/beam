import React from "react"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, View, TouchableNativeFeedback } from "react-native"
import { Badge, Image, Text } from "react-native-elements"
import fonts from "styles/fonts"
import { theme } from "styles/theme"

type IProps = {
    item: {
        id: string
        name: string
        timestamp: string
        image?: string
        unreadCount: number
        message: {
            text: string
        }
    }
}
export function ChatItem({ item }: IProps) {
    const navigation = useNavigation()

    return (
        <TouchableNativeFeedback onPress={() => navigation.navigate("Chat", { friendId: item.id })}>
            <View style={styles.container}>
                <Image
                    style={styles.avatarStyle}
                    source={item.image ? { uri: item.image } : require("assets/images/beambot.png")}
                />

                <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={{ ...fonts.semiBold }} numberOfLines={1}>
                                {item.name}
                            </Text>
                        </View>

                        <Text style={{ fontSize: 14 }}>{item.timestamp}</Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text numberOfLines={1}>{item.message.text}</Text>
                        </View>

                        {!!item.unreadCount && (
                            <Badge badgeStyle={{ borderWidth: 0 }} value={item.unreadCount} />
                        )}
                    </View>
                </View>
            </View>
        </TouchableNativeFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 25,
        paddingHorizontal: 20,
        borderBottomColor: theme.colors?.grey3,
        borderBottomWidth: 1,
    },

    avatarStyle: {
        borderWidth: 3,
        borderColor: theme.colors?.purple3,
        borderRadius: 10,
        width: 55,
        height: 55,
    },

    itemContent: {
        flex: 1,
        marginLeft: 15,
    },

    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
})
