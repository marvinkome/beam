import "react-native-gesture-handler"
import React from "react"
import Toast from "react-native-toast-message"
import { View, ActivityIndicator, StatusBar } from "react-native"
import { ThemeProvider } from "react-native-elements"
import { GoogleSignin } from "@react-native-community/google-signin"
import { NavigationContainer } from "@react-navigation/native"
import { RootNavigator } from "navigators"
import { ApolloProvider } from "@apollo/client"
import { MenuProvider } from "react-native-popup-menu"
import { AuthContext } from "libs/auth-context"
import { theme, reactNavigationTheme } from "styles/theme"
import { navigationRef } from "libs/navigator"
import { useAppSetup } from "hooks"
import { Loader } from "components"

GoogleSignin.configure()

export default function App() {
    const appData = useAppSetup()

    if (appData.isLoading) {
        // TODO: hide splash screen

        return <Loader />
    }

    return (
        <ThemeProvider theme={theme}>
            <StatusBar backgroundColor="#261D3E" />

            <ApolloProvider client={appData.apolloClient}>
                <AuthContext.Provider value={appData.authContext}>
                    <MenuProvider>
                        <NavigationContainer theme={reactNavigationTheme} ref={navigationRef}>
                            <RootNavigator />

                            <Toast ref={(ref: any) => Toast.setRef(ref)} />
                        </NavigationContainer>
                    </MenuProvider>
                </AuthContext.Provider>
            </ApolloProvider>
        </ThemeProvider>
    )
}
