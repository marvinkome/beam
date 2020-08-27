import React, { useEffect, Suspense, useCallback } from "react"
import { Switch, Route, useHistory, useLocation, Redirect } from "react-router-dom"
import { AUTH_TOKEN, ONBOARDING_KEY } from "lib/keys"
import { isMobile } from "lib/helpers"
import { trackPageView } from "lib/GA"
import { DesktopWarning } from "components/desktopWarning"
import { PageLoader } from "components/page-loader"
import { setupPushNotification, setupNotificationListener } from "lib/notification"
import { useMutation, gql } from "@apollo/client"
import { toast } from "react-toastify"
import { messaging } from "firebase"

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

// setup hooks
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

function useNotifications() {
    const onboarded = !!localStorage.getItem(ONBOARDING_KEY)
    const [setToken] = useMutation(gql`
        mutation RegisterDeviceToken($token: String!) {
            setupNotifications(token: $token)
        }
    `)

    const setupPushNotificationCb = useCallback(async () => {
        const token = await setupPushNotification()

        if (!token) {
            return
        }

        const { data } = await setToken({ variables: { token } })

        if (!data.setupNotifications) {
            toast.dark("Failed to setup push notifications")
        }
    }, [setToken])

    useEffect(() => {
        // if user has finished onboarding - setup notification permission
        if (onboarded) {
            setupPushNotificationCb()
        }
    }, [onboarded, setupPushNotificationCb])

    // listen for notifications
    const onNewNotification = useCallback((payload) => {
        // check if user is in the supplied chat/group id, if not create and show notification
        // At this point we can't do anything until we have an in-app notification system
    }, [])

    useEffect(() => {
        setupNotificationListener(onNewNotification)
    })
}

export function MainPages() {
    // setups
    useGAPageTracking()
    useNotifications()

    return isMobile() ? (
        <Suspense fallback={<PageLoader />}>
            <Switch>
                <ProtectedRoute exact path="/app/chats" component={Chats} />
                <ProtectedRoute exact path="/app/chat/:friendId" component={Chat} />
                <ProtectedRoute exact path="/app/group/:groupId" component={GroupChat} />
                <ProtectedRoute exact path="/app/profile" component={Profile} />
                <ProtectedRoute exact path="/app/find-friend" component={FindFriend} />

                {!localStorage.getItem(ONBOARDING_KEY) ? (
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
