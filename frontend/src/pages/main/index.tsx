import React, { useEffect, Suspense } from "react"
import { Switch, Route, useLocation, Redirect } from "react-router-dom"
import { DesktopWarning, PageLoader, LocationPermission } from "components"
import { useAppSetup } from "hooks"
import { trackPageView } from "lib/analytics"

// dynamically load pages to implement code spliting
const Chats = React.lazy(() =>
    import("./chats").then((module) => ({
        default: module.Chats,
    }))
)

const Chat = React.lazy(() =>
    import("./chat").then((module) => ({
        default: module.Chat,
    }))
)

const GroupChat = React.lazy(() =>
    import("./group-chat").then((module) => ({
        default: module.GroupChat,
    }))
)

const JoinGroup = React.lazy(() =>
    import("./join-group").then((module) => ({
        default: module.JoinGroup,
    }))
)

const FindFriend = React.lazy(() =>
    import("./find-friend").then((module) => ({
        default: module.FindFriend,
    }))
)

const Profile = React.lazy(() =>
    import("./profile").then((module) => ({
        default: module.Profile,
    }))
)

const OnBoarding = React.lazy(() =>
    import("./onboarding").then((module) => ({
        default: module.OnBoarding,
    }))
)

export function MainPages() {
    // track page view with analytics
    const location = useLocation()
    useEffect(() => {
        if (location.pathname.includes("/chat/")) {
            trackPageView("/app/chat")
        } else {
            trackPageView(location.pathname)
        }
    }, [location.pathname])

    // setup app
    const { action, getLocation } = useAppSetup()

    if (action === "redirect-to-public") {
        return <Redirect to="/" />
    }

    if (action === "render-desktop") {
        return <DesktopWarning />
    }

    if (action === "request-permission") {
        return <LocationPermission getLocation={getLocation} />
    }

    if (action === "render") {
        return (
            <Suspense fallback={<PageLoader />}>
                <Switch>
                    {/* chats lists */}
                    <Route exact path="/app/chats" component={Chats} />

                    {/* chat page */}
                    <Route exact path="/app/chat/:friendId" component={Chat} />
                    <Route exact path="/app/group/:groupId" component={GroupChat} />

                    {/* find more */}
                    <Route exact path="/app/join-group" component={JoinGroup} />
                    <Route exact path="/app/find-friend" component={FindFriend} />

                    {/* profile */}
                    <Route exact path="/app/profile" component={Profile} />

                    {/* onboarding */}
                    <Route exact path="/app/onboarding" component={OnBoarding} />
                </Switch>
            </Suspense>
        )
    }

    return <PageLoader />
}
