import React, { useState } from "react"
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs"
import { StyleSheet, View, TouchableOpacity } from "react-native"
import { Icon, BottomSheet, Text } from "react-native-elements"
import { theme } from "styles/theme"
import fonts from "styles/fonts"

export function CreateStatusButton(props: BottomTabBarButtonProps) {
    const [isVisible, setSheetVisibility] = useState(false)
    const toggleVisibily = () => {
        setSheetVisibility(!isVisible)
    }

    return (
        <>
            <View style={props.style}>
                <TouchableOpacity onPress={toggleVisibily}>
                    <View style={styles.createStatusIconContainer}>
                        <Icon name="pencil" type="ionicon" />
                    </View>
                </TouchableOpacity>
            </View>

            <BottomSheet modalProps={{}} isVisible={isVisible}>
                <View style={styles.bottomSheet}>
                    <View style={styles.bottomSheetHeader}>
                        <Text style={styles.bottomSheetHeaderText}>
                            Share something interesting
                        </Text>
                    </View>

                    <View style={styles.statusTypeContainer}>
                        <View style={styles.statusType}>
                            <Text style={{ ...fonts.semiBold }}>Text</Text>
                            <Icon
                                size={25}
                                name="text"
                                type="ionicon"
                                onPress={() => null}
                                containerStyle={{ marginTop: 10 }}
                                raised
                            />
                        </View>

                        <View style={styles.statusType}>
                            <Text style={{ ...fonts.semiBold }}>Image</Text>
                            <Icon
                                size={25}
                                name="ios-image-outline"
                                type="ionicon"
                                onPress={() => null}
                                containerStyle={{ marginTop: 10 }}
                                raised
                            />
                        </View>

                        <View style={styles.statusType}>
                            <Text style={{ ...fonts.semiBold }}>Link</Text>
                            <Icon
                                size={25}
                                name="link"
                                type="feather"
                                onPress={() => null}
                                containerStyle={{ marginTop: 10 }}
                                raised
                            />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Icon size={30} name="close" type="ionicon" onPress={toggleVisibily} />
                    </View>
                </View>
            </BottomSheet>
        </>
    )
}

const styles = StyleSheet.create({
    createStatusIconContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors?.primary,
        width: 65,
        height: 65,
        borderRadius: 50,
        borderWidth: 5,
        marginBottom: 3,
        borderColor: "#4A3C70",
    },

    bottomSheet: {
        backgroundColor: theme.colors?.purple3,
        paddingHorizontal: 30,
        paddingVertical: 25,
        height: 250,
    },

    bottomSheetHeader: {
        alignItems: "center",
    },

    bottomSheetHeaderText: {
        ...fonts.semiBold,
        fontSize: 17,
    },

    statusTypeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",

        paddingTop: 35,
        paddingHorizontal: 15,
    },

    statusType: {
        justifyContent: "center",
        alignItems: "center",
    },

    footer: {
        paddingTop: 15,
    },
})
