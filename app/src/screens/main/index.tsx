import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { routesName } from "libs/navigator"

// screens
import { Chats } from "./chats"
import { Onboarding } from "./onboarding"

const MainStack = createStackNavigator()
export function MainPages() {
    // TODO:: track page view

    // setup app

    return (
        <MainStack.Navigator>
            <MainStack.Screen
                name={routesName.Onboarding}
                component={Onboarding}
                options={{ headerShown: false }}
            />

            <MainStack.Screen name={routesName.Chats} component={Chats} />
        </MainStack.Navigator>
    )
}
