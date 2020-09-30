import React from "react"
import { ActivityIndicator, View } from "react-native"
import { ApolloProvider } from "@apollo/client"
import { GoogleSignin } from "@react-native-community/google-signin"
import { createStackNavigator } from "@react-navigation/stack"

import { useAppSetup } from "hooks"

// screens
import { AuthContext } from "./auth-context"
import { theme } from "styles/theme"
import { MainPages } from "./main"
import { PublicPages } from "./public"

// configure
const RootStack = createStackNavigator()
GoogleSignin.configure()

export function RootNavigation() {
    const appData = useAppSetup()

    if (appData.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator color={theme.colors?.primary} size="large" />
            </View>
        )
    }

    return (
        <ApolloProvider client={appData.apolloClient}>
            <AuthContext.Provider value={appData.authContext}>
                <RootStack.Navigator headerMode="none">
                    {appData.isLoggedIn ? (
                        <RootStack.Screen name="Main" component={MainPages} />
                    ) : (
                        <RootStack.Screen name="Public" component={PublicPages} />
                    )}
                </RootStack.Navigator>
            </AuthContext.Provider>
        </ApolloProvider>
    )
}
