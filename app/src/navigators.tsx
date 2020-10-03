import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AuthContext } from "libs/auth-context"
import { useContext } from "react"

// screens
import { LandingPage } from "screens/LandingPage"
import { OnboardingImportContacts } from "screens/OnboardingImportContacts"
import { Status } from "screens/Status"
import { StatusComments } from "screens/StatusComments"
import { CreateStatus } from "screens/CreateStatus"
import { Chats } from "screens/Chats"
import { Chat } from "screens/Chat"
import { Profile } from "screens/Profile"

// navigators
const HomeTab = createBottomTabNavigator()
export function HomeTabNavigator() {
    return (
        <HomeTab.Navigator>
            <HomeTab.Screen name="Status" component={Status} />
            <HomeTab.Screen name="CreateStatus" component={CreateStatus} />
            <HomeTab.Screen name="Chats" component={Chats} />
        </HomeTab.Navigator>
    )
}

const MainStack = createStackNavigator()
export function MainStackNavigator() {
    return (
        <MainStack.Navigator headerMode="none">
            <MainStack.Screen name="Home" component={HomeTabNavigator} />
            <MainStack.Screen name="Chat" component={Chat} />
            <MainStack.Screen name="Profile" component={Profile} />
            <MainStack.Screen name="StatusComments" component={StatusComments} />
        </MainStack.Navigator>
    )
}

const OnboardingStack = createStackNavigator()
export function OnboardingStackNavigator() {
    return (
        <OnboardingStack.Navigator headerMode="none">
            <OnboardingStack.Screen
                name="OnboardingImportContacts"
                component={OnboardingImportContacts}
            />
        </OnboardingStack.Navigator>
    )
}

// root
const RootStack = createStackNavigator()
export function RootNavigator() {
    const authContext = useContext(AuthContext)

    return (
        <RootStack.Navigator headerMode="none">
            {authContext.isLoggedIn ? (
                <>
                    <RootStack.Screen name="Main" component={MainStackNavigator} />
                    <RootStack.Screen name="Onboarding" component={OnboardingStackNavigator} />
                </>
            ) : (
                <RootStack.Screen name="LandingPage" component={LandingPage} />
            )}
        </RootStack.Navigator>
    )
}
