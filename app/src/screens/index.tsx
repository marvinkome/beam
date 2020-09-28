import React from "react"
import Toast from "react-native-toast-message"
import { GoogleSignin } from "@react-native-community/google-signin"
import { createStackNavigator } from "@react-navigation/stack"

// public screens
import { LandingPage } from "./public/landing-page"

const Stack = createStackNavigator()
GoogleSignin.configure()

export function RootNavigation() {
    return (
        <>
            <Stack.Navigator headerMode="none">
                {/* main */}

                {/* public */}
                <Stack.Screen name="LandingPage" component={LandingPage} />
            </Stack.Navigator>

            <Toast ref={(ref: any) => Toast.setRef(ref)} />
        </>
    )
}
