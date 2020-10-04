import React from "react"
import BeamLogo from "assets/images/beam-logo-light.svg"
import { StyleSheet, View } from "react-native"
import { Text, Image, Icon } from "react-native-elements"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu"
import { theme } from "styles/theme"

export function ChatsHeader() {
    return (
        <View style={styles.container}>
            <BeamLogo width={100} height={70} />

            <Menu>
                <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableOpacity }}>
                    <Image
                        style={styles.userImage}
                        containerStyle={styles.userImageContainer}
                        source={require("assets/images/me.jpeg")}
                        resizeMode="contain"
                    />
                </MenuTrigger>

                <MenuOptions
                    customStyles={{
                        optionsContainer: styles.menuWrapper,
                        optionWrapper: styles.menuOptionWrapper,
                    }}
                >
                    <MenuOption onSelect={() => null}>
                        <Icon name="settings" type="feather" size={20} style={styles.menuIcon} />
                        <Text>Profile settings</Text>
                    </MenuOption>

                    <MenuOption onSelect={() => null}>
                        <Icon name="user-plus" type="feather" size={20} style={styles.menuIcon} />
                        <Text>Invite a friend</Text>
                    </MenuOption>

                    <MenuOption onSelect={() => null}>
                        <Icon
                            name="share-social-outline"
                            type="ionicon"
                            size={20}
                            color="#317FF5"
                            style={styles.menuIcon}
                        />
                        <Text style={{ color: "#317FF5" }}>Share Beam</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: theme.colors?.grey0,
    },
    logo: {
        width: 100,
        height: 70,
    },
    userImageContainer: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: theme.colors?.purple5,
    },
    userImage: {
        width: 40,
        height: 40,
    },

    menuWrapper: {
        backgroundColor: theme.colors?.purple2,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: theme.colors?.purple2,
    },
    menuOptionWrapper: {
        flexDirection: "row",
        padding: 20,
    },
    menuIcon: {
        marginRight: 15,
    },
})
