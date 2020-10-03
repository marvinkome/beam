import "react-native-gesture-handler"
import React from "react"
import Toast from "react-native-toast-message"
import { View, ActivityIndicator } from "react-native"
import { ThemeProvider } from "react-native-elements"
import { GoogleSignin } from "@react-native-community/google-signin"
import { NavigationContainer } from "@react-navigation/native"
import { RootNavigator } from "navigators"
import { ApolloProvider } from "@apollo/client"
import { AuthContext } from "libs/auth-context"
import { theme, reactNavigationTheme } from "styles/theme"
import { navigationRef } from "libs/navigator"
import { useAppSetup } from "hooks"

GoogleSignin.configure()

export default function App() {
    const appData = useAppSetup()

    if (appData.isLoading) {
        // TODO: hide splash screen

        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator color={theme.colors?.primary} size="large" />
            </View>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <ApolloProvider client={appData.apolloClient}>
                <AuthContext.Provider value={appData.authContext}>
                    <NavigationContainer theme={reactNavigationTheme} ref={navigationRef}>
                        <RootNavigator />

                        <Toast ref={(ref: any) => Toast.setRef(ref)} />
                    </NavigationContainer>
                </AuthContext.Provider>
            </ApolloProvider>
        </ThemeProvider>
    )
}
