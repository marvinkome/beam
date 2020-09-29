import { createRef } from "react"
import { NavigationContainerRef } from "@react-navigation/native"

export const navigationRef = createRef<NavigationContainerRef>()
export function navigate(name: string, params?: any) {
    navigationRef.current?.navigate(name, params)
}

export const routesName = {
    // public
    LandingPage: "LandingPage",

    // main
    Chats: "Chats",
    FriendChat: "FriendChat",
    FindFriend: "FindFriend",
    Invites: "Invites",
    Profile: "Profile",
    Onboarding: "Onboarding",
} as const
