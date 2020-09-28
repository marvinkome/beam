import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

// public screens
import { LandingPage } from "./public/landing-page"

const Stack = createStackNavigator()

export function RootNavigation() {
    return (
        <Stack.Navigator headerMode="none">
            {/* main */}

            {/* public */}
            <Stack.Screen name="LandingPage" component={LandingPage} />
        </Stack.Navigator>
    )
}
