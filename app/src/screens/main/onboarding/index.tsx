import React from "react"
import { View, Text } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"

// steps
import { Profile } from "./profile"
import { ConnectAccount } from "./connect-account"
import { SendInvite } from "./send-invite"

const OnboardingStack = createStackNavigator()
export function Onboarding() {
    return (
        <OnboardingStack.Navigator headerMode="none">
            <OnboardingStack.Screen name="OnboardingProfile" component={Profile} />
            <OnboardingStack.Screen name="OnboardingConnect" component={ConnectAccount} />
            <OnboardingStack.Screen name="OnboardingSendInvite" component={SendInvite} />
        </OnboardingStack.Navigator>
    )
}
