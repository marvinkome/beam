import React, { useEffect, Suspense } from "react"
import { Switch, Route, useHistory, useLocation } from "react-router-dom"
import { AUTH_TOKEN, ONBOARDING_KEY } from "lib/keys"
import { isMobile } from "lib/helpers"
import { trackPageView } from "lib/GA"
import { DesktopWarning } from "components/desktopWarning"
import { PageLoader } from "components/page-loader"

// PAGES
const Chats = React.lazy(() => import("./chats").then((module) => ({ default: module.Chats })))
const Chat = React.lazy(() => import("./chat").then((module) => ({ default: module.Chat })))
const GroupChat = React.lazy(() =>
    import("./group-chat").then((module) => ({ default: module.GroupChat }))
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

export function useAuth() {
    const history = useHistory()
    const { pathname } = useLocation()
    const onboarded = localStorage.getItem(ONBOARDING_KEY)

    useEffect(() => {
        if (!localStorage.getItem(AUTH_TOKEN)) {
            return history.push("/")
        }
    }, [history, pathname, onboarded])
}

export function MainPages() {
    useAuth()
    const location = useLocation()
    useEffect(() => {
        if (location.pathname.includes("/chat/")) {
            trackPageView("/app/chat")
        } else {
            trackPageView(location.pathname)
        }
    }, [location.pathname])

    return isMobile() ? (
        <Suspense fallback={<PageLoader />}>
            <Switch>
                <Route exact path="/app/onboarding" component={OnBoarding} />
                <Route exact path="/app/chats" component={Chats} />
                <Route exact path="/app/chat/:friendId" component={Chat} />
                <Route exact path="/app/group/:groupId" component={GroupChat} />
                <Route exact path="/app/profile" component={Profile} />
                <Route exact path="/app/find-friend" component={FindFriend} />
            </Switch>
        </Suspense>
    ) : (
        <DesktopWarning />
    )
}
