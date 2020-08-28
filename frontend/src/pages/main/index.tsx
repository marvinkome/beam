import React, { useEffect, Suspense } from "react"
import { Switch, Route, useHistory, useLocation, Redirect } from "react-router-dom"
import { AUTH_TOKEN, ONBOARDING_KEY } from "lib/keys"
import { isMobile } from "lib/helpers"
import { trackPageView } from "lib/analytics"
import { DesktopWarning } from "components/desktopWarning"
import { PageLoader } from "components/page-loader"

// PAGES
const Chats = React.lazy(() => import("./chats").then((module) => ({ default: module.Chats })))
const Chat = React.lazy(() => import("./chat").then((module) => ({ default: module.Chat })))
const GroupChat = React.lazy(() =>
    import("./group-chat").then((module) => ({ default: module.GroupChat }))
)
const JoinGroup = React.lazy(() =>
    import("./join-group").then((module) => ({ default: module.JoinGroup }))
)
const FindFriend = React.lazy(() =>
    import("./find-friend").then((module) => ({ default: module.FindFriend }))
)
const Profile = React.lazy(() =>
    import("./profile").then((module) => ({ default: module.Profile }))
)
const OnBoarding = React.lazy(() =>
    import("./onboarding").then((module) => ({ default: module.OnBoarding }))
)

function ProtectedRoute({ component: Component, ...rest }: any) {
    const history = useHistory()

    useEffect(() => {
        if (!localStorage.getItem(AUTH_TOKEN)) {
            return history.push("/")
        }
    }, [history])

    return <Route {...rest} render={(props) => <Component {...rest} {...props} />} />
}

function useGAPageTracking() {
    const location = useLocation()
    useEffect(() => {
        if (location.pathname.includes("/chat/")) {
            trackPageView("/app/chat")
        } else {
            trackPageView(location.pathname)
        }
    }, [location.pathname])
}

export function MainPages() {
    useGAPageTracking()

    return isMobile() ? (
        <Suspense fallback={<PageLoader />}>
            <Switch>
                <ProtectedRoute exact path="/app/chats" component={Chats} />
                <ProtectedRoute exact path="/app/chat/:friendId" component={Chat} />
                <ProtectedRoute exact path="/app/group/:groupId" component={GroupChat} />
                <ProtectedRoute exact path="/app/profile" component={Profile} />
                <ProtectedRoute exact path="/app/join-group" component={JoinGroup} />
                <ProtectedRoute exact path="/app/find-friend" component={FindFriend} />

                {localStorage.getItem(ONBOARDING_KEY) !== "true" ? (
                    <ProtectedRoute exact path="/app/onboarding" component={OnBoarding} />
                ) : (
                    <Redirect to="/app/chats" />
                )}
            </Switch>
        </Suspense>
    ) : (
        <DesktopWarning />
    )
}
