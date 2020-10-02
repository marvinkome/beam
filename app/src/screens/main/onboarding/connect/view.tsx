import React from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { Button, Text } from "react-native-elements"
import { ConnectAccount } from "components/connect-account"

export function ConnectAccountView() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.pageHeader}>
                <Text h1>Connect your accounts</Text>
                <Text style={styles.headerText}>
                    Your interests on these platforms help us pair you with people who love the same
                    things.
                </Text>
            </View>

            <View style={styles.pageContent}>
                <ConnectAccount />
            </View>

            <Button containerStyle={{ marginTop: "auto" }} title="CONTINUE" />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 52,
        flex: 1,
    },
    pageHeader: {},
    headerText: {
        marginTop: 30,
    },

    pageContent: {
        marginBottom: 20,
    },
})
