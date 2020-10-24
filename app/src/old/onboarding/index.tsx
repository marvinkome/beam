import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

// steps
import { ConnectAccount } from "./connect"
import { SendInvite } from "./send-invite"
import { Location } from "./location"

const OnboardingStack = createStackNavigator()
export function Onboarding() {
    return (
        <OnboardingStack.Navigator initialRouteName="OnboardingConnect" headerMode="none">
            <OnboardingStack.Screen name="OnboardingLocation" component={Location} />
            <OnboardingStack.Screen name="OnboardingConnect" component={ConnectAccount} />
            <OnboardingStack.Screen name="OnboardingSendInvite" component={SendInvite} />
        </OnboardingStack.Navigator>
    )
}
