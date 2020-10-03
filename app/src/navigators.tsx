import React, { useContext } from "react"
import Beam from "assets/icons/beam.svg"
import { View } from "react-native"
import { Icon } from "react-native-elements"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AuthContext } from "libs/auth-context"
import { navigationStyle } from "styles/navigator"
import { theme } from "styles/theme"

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
        <HomeTab.Navigator tabBarOptions={{ showLabel: false, style: navigationStyle.tabBar }}>
            <HomeTab.Screen
                name="Status"
                component={Status}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Beam color={focused ? theme.colors?.primary : theme.colors?.white} />
                    ),
                }}
            />

            <HomeTab.Screen
                name="CreateStatus"
                component={CreateStatus}
                options={{
                    tabBarIcon: () => (
                        <View style={navigationStyle.createStatusIconContainer}>
                            <Icon name="pencil" type="octicon" color={theme.colors?.white} />
                        </View>
                    ),
                }}
            />

            <HomeTab.Screen
                name="Chats"
                component={Chats}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="chatbubbles-outline"
                            type="ionicon"
                            color={focused ? theme.colors?.primary : theme.colors?.white}
                        />
                    ),
                }}
            />
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
