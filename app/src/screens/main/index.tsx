import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { routesName } from "libs/navigator"

// screens
import { Chats } from "./chats"
import { Onboarding } from "./onboarding"

const MainStack = createStackNavigator()
export function MainPages() {
    console.log("call me maybe")

    return (
        <MainStack.Navigator>
            <MainStack.Screen name={routesName.Chats} component={Chats} />
            <MainStack.Screen name={routesName.Onboarding} component={Onboarding} />
        </MainStack.Navigator>
    )
}
