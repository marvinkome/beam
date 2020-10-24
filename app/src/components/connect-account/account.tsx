import React from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { Image, Text, Icon } from "react-native-elements"
import { theme } from "styles/theme"

const images = {
    reddit: require("assets/images/reddit.png"),
    youtube: require("assets/images/youtube.png"),
    spotify: require("assets/images/spotify.png"),
}

type IProps = {
    account: "youtube" | "reddit" | "spotify"
    description: string
    isConnected: boolean
    hasDisconnect?: boolean
}
export function Account(props: IProps) {
    const loading = false

    // styles
    const containerStyle: any[] = [styles.container, accountStyles.container[props.account]]
    let loaderColor = accountStyles.loader[props.account].color
    const accountTypeStyles: any[] = [styles.accountType, accountStyles.accountType[props.account]]
    const accountDescStyles: any[] = [styles.accountDesc]

    // details
    let accountName = `Connect ${props.account}`
    let description = props.description

    if (props.isConnected) {
        containerStyle.push(connectedStyles.container)
        loaderColor = connectedStyles.loader.color
        accountTypeStyles.push(connectedStyles.accountType)
        accountDescStyles.push(connectedStyles.accountDesc)

        accountName = `${props.account} connected`.replace(/./, (l) => l.toUpperCase())
        description = `${props.description.replace(/We'll scan your /, "")} scanned`
    }

    // image
    let accountImage = <Image style={styles.accountImage} source={images[props.account]} />
    if (loading) {
        accountImage = <ActivityIndicator size="large" color={loaderColor} />
    } else if (props.isConnected) {
        accountImage = <Icon size={40} color="#fff" name="check" type="feather" />
    }

    return (
        <View style={containerStyle}>
            {accountImage}

            <View style={styles.accountDetails}>
                <Text style={accountTypeStyles}>{accountName}</Text>
                <Text style={accountDescStyles}>
                    {description.replace(/./, (l) => l.toUpperCase())}
                </Text>
            </View>

            {props.hasDisconnect && props.isConnected && <Icon name="x" type="feather" />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
    },

    accountImage: {
        width: 40,
        height: 40,
    },

    accountDetails: {
        marginLeft: 20,
        marginRight: "auto",
    },

    accountType: {
        color: "#121212",
        marginTop: 5,
        fontFamily: "SourceSansPro-SemiBold",
        fontSize: 18,
    },
    accountDesc: {
        color: "#121212",
        marginTop: 5,
        fontSize: 14,
    },
})

const accountStyles = {
    container: {
        youtube: {
            borderColor: "rgba(255, 0, 0, 0.5)",
        },
        spotify: {
            borderColor: "rgb(30, 215, 96)",
        },
        reddit: {
            borderColor: "#ff4500",
        },
    },

    loader: {
        youtube: {
            color: "rgb(255, 0, 0)",
        },
        spotify: {
            color: "rgb(30, 215, 96)",
        },
        reddit: {
            color: "#ff4500",
        },
    },

    accountType: {
        youtube: {
            color: "rgb(255, 0, 0)",
        },
        spotify: {
            color: "rgb(30, 215, 96)",
        },
        reddit: {
            color: "#ff4500",
        },
    },
}

const connectedStyles = StyleSheet.create({
    container: {
        backgroundColor: "#9ed3b7",
        borderWidth: 0,
    },
    loader: {
        color: "#79c39c",
    },
    accountType: {
        color: "#ffffff",
    },
    accountDesc: {
        color: "#ffffff",
    },
})
