import React from "react"
import BeamLogo from "assets/images/beam-logo-light.svg"
import { StyleSheet, View, Share, Alert } from "react-native"
import { Text, Image, Icon } from "react-native-elements"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu"
import { theme } from "styles/theme"
import { useNavigation } from "@react-navigation/native"
import { useMutation, gql } from "@apollo/client"

type IProps = {
    picture: string
    onShareBeam: () => void
}
function ChatsHeaderView({ picture, onShareBeam }: IProps) {
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <BeamLogo width={100} height={70} />

            <Menu>
                <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableOpacity }}>
                    <Image
                        style={styles.userImage}
                        containerStyle={styles.userImageContainer}
                        source={{ uri: picture }}
                        resizeMode="contain"
                    />
                </MenuTrigger>

                <MenuOptions
                    customStyles={{
                        optionsContainer: styles.menuWrapper,
                        optionWrapper: styles.menuOptionWrapper,
                    }}
                >
                    <MenuOption onSelect={() => navigation.navigate("Profile")}>
                        <Icon name="settings" type="feather" size={20} style={styles.menuIcon} />
                        <Text>Profile settings</Text>
                    </MenuOption>

                    <MenuOption onSelect={() => null}>
                        <Icon name="user-plus" type="feather" size={20} style={styles.menuIcon} />
                        <Text>Add a friend</Text>
                    </MenuOption>

                    <MenuOption onSelect={onShareBeam}>
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

export function ChatsHeader({ picture }: { picture: string }) {
    const [getInviteLink] = useMutation(gql`
        mutation CreateInviteLink {
            createInviteLink
        }
    `)

    const onShareBeam = async () => {
        try {
            const res = await Share.share({
                message:
                    "Hey,\nBeam is a place where you can share interesting things with your friends. Come over it's free!\nhttps://usebeam.chat",
            })

            if (res.action === Share.sharedAction) {
                console.log("shared with", res.activityType)
            }
        } catch (e) {
            // TODO: Sentry track issue with sharing
        }
    }

    return <ChatsHeaderView picture={picture} onShareBeam={onShareBeam} />
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: theme.colors?.grey3,
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
