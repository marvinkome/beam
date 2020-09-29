import React, { useEffect, useReducer, useMemo } from "react"
import AsyncStorage from "@react-native-community/async-storage"
import { ActivityIndicator, View } from "react-native"
import { ApolloProvider } from "@apollo/client"
import { GoogleSignin } from "@react-native-community/google-signin"
import { createStackNavigator } from "@react-navigation/stack"
import { client } from "libs/graphql"
import { AUTH_TOKEN } from "libs/keys"

// screens
import { AuthContext } from "./auth-context"
import { theme } from "styles/theme"
import { MainPages } from "./main"
import { PublicPages } from "./public"

// configure
const RootStack = createStackNavigator()
GoogleSignin.configure()

export function RootNavigation() {
    const initialState = { isLoading: true, isLoggedIn: false }
    const [state, dispatch] = useReducer((prev: any, action: any) => {
        switch (action.type) {
            case "RESTORE_TOKEN":
                return { ...prev, isLoading: false, isLoggedIn: action.isLoggedIn }
            case "SIGN_IN_OR_OUT":
                return { ...prev, isLoading: false, isLoggedIn: action.isLoggedIn }
        }
    }, initialState)

    useEffect(() => {
        const getTokenAsync = async () => {
            const token = await AsyncStorage.getItem(AUTH_TOKEN)
            dispatch({ type: "RESTORE_TOKEN", isLoggedIn: !!token })
        }

        getTokenAsync()
    }, [])

    const authContext = useMemo(
        () => ({
            signIn: () => dispatch({ type: "SIGN_IN_OR_OUT", isLoggedIn: true }),
            signOut: () => dispatch({ type: "SIGN_IN_OR_OUT", isLoggedIn: false }),
        }),
        []
    )

    if (state.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator color={theme.colors?.primary} size="large" />
            </View>
        )
    }

    return (
        <ApolloProvider client={client}>
            <AuthContext.Provider value={authContext}>
                <RootStack.Navigator headerMode="none">
                    {state.isLoggedIn ? (
                        <RootStack.Screen name="Main" component={MainPages} />
                    ) : (
                        <RootStack.Screen name="Public" component={PublicPages} />
                    )}
                </RootStack.Navigator>
            </AuthContext.Provider>
        </ApolloProvider>
    )
}
