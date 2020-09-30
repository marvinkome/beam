import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { routesName } from "libs/navigator"

// screens
import { LandingPage } from "./landing-page"

const PublicStack = createStackNavigator()
export function PublicPages() {
    // TODO:: track page views

    return (
        <PublicStack.Navigator headerMode="none">
            <PublicStack.Screen name={routesName.LandingPage} component={LandingPage} />
        </PublicStack.Navigator>
    )
}
