import React from "react"
import { ScrollView, View, StyleSheet } from "react-native"
import { Text, Button, Image } from "react-native-elements"
import { TextButton, TextLink } from "components"
import { useGoogleAuth } from "hooks"

export function LandingPage() {
    const { signIn, loading } = useGoogleAuth()

    return (
        <ScrollView style={styles.container}>
            {/* navbar */}
            <View>
                <Image
                    style={styles.logo}
                    source={require("assets/images/beam-logo-dark.png")}
                    resizeMode="contain"
                />
            </View>

            {/* page content */}
            <View style={styles.pageContent}>
                {/* header */}
                <Text style={styles.headerText} h1>
                    Find local friends who love what you love
                </Text>

                {/* image */}
                <Image
                    style={styles.screenshot}
                    source={require("assets/images/screenshot.png")}
                    resizeMode="contain"
                />

                {/* cta */}
                <View style={styles.headerActions}>
                    <Button
                        containerStyle={styles.mainButton}
                        titleStyle={styles.mainButtonText}
                        title="Sign up with Google"
                        onPress={signIn}
                        loading={loading}
                    />

                    <Text>
                        Already have an account? <TextButton onPress={signIn}>Login</TextButton>
                    </Text>
                </View>
            </View>

            {/* footer */}
            <View style={styles.footer}>
                <TextLink href="https://usebeam.chat/privacy-policy">Privacy Policy</TextLink>
                <TextLink href="https://usebeam.chat/terms-and-condition">Terms of use</TextLink>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
    },

    logo: {
        width: 100,
        height: 70,
    },

    pageContent: {
        paddingBottom: 16,
        paddingVertical: 10,
    },

    headerText: {
        textAlign: "center",
        marginBottom: 36,
    },

    screenshot: {
        width: 350,
        height: 400,
    },

    headerActions: {
        marginTop: 30,
        alignItems: "center",
    },

    mainButton: {
        width: "100%",
        marginBottom: 8,
    },
    mainButtonText: {
        textTransform: "uppercase",
    },

    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: "20%",
        marginBottom: 16,
    },
})
