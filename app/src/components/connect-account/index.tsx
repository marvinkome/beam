import React from "react"
import { StyleSheet, View } from "react-native"
import { Account } from "./account"

export function ConnectAccount() {
    return (
        <View style={styles.container}>
            <Account
                account="youtube"
                description="We'll scan your subscriptions"
                isConnected={true}
            />
            <Account
                account="spotify"
                description="We'll scan your genre and top artists"
                isConnected={false}
            />
            <Account
                account="reddit"
                description="We'll scan your subreddits"
                isConnected={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 30,
    },
})
