import React, { Suspense } from "react"
import { Route, Redirect, Router, Switch } from "react-router-dom"
import { DesktopWarning } from "components/desktopWarning"
import { isMobile } from "lib/helpers"
import { AUTH_TOKEN, ONBOARDING_KEY } from "lib/keys"
import { history } from "lib/history"
import { PageLoader } from "components/page-loader"

// configs

const ROUTES = {
    // PUBLIC PAGES
    index: "/",
    invitePage: "/invite/:inviteToken",
    privacyPolicy: "/privacy-policy",
    terms: "/terms-and-condition",
    acceptableUse: "/acceptable-use",
    oauthRedirect: "/oauth-redirect",

    // ONBOARDING
    onboarding: "/app/onboarding",

    // main
    chats: "/app/chats",
    friendChat: "/app/chat/:friendId",
    groupChat: "/app/group/:groupId",
    profile: "/app/profile",
    findFriend: "/app/find-friend",
} as const

const PUBLIC_CONFIG = {
    [ROUTES.index]: React.lazy(() =>
        import("./public/landing-page").then((module) => ({ default: module.LandingPage }))
    ),

    [ROUTES.invitePage]: React.lazy(() =>
        import("./public/auth").then((module) => ({ default: module.AuthPage }))
    ),

    [ROUTES.oauthRedirect]: () => <p>Connecting account</p>,

    [ROUTES.privacyPolicy]: React.lazy(() =>
        import("./public/privacy-policy").then((module) => ({ default: module.PrivacyPolicy }))
    ),

    [ROUTES.terms]: React.lazy(() =>
        import("./public/terms").then((module) => ({ default: module.Terms }))
    ),

    [ROUTES.acceptableUse]: React.lazy(() =>
        import("./public/acceptable-use").then((module) => ({ default: module.AcceptableUse }))
    ),
} as const

const MAIN_CONFIG = {
    [ROUTES.chats]: React.lazy(() =>
        import("./main/chats").then((module) => ({ default: module.Chats }))
    ),

    [ROUTES.friendChat]: React.lazy(() =>
        import("./main/chat").then((module) => ({ default: module.Chat }))
    ),

    [ROUTES.groupChat]: React.lazy(() =>
        import("./main/group-chat").then((module) => ({ default: module.GroupChat }))
    ),

    [ROUTES.profile]: React.lazy(() =>
        import("./main/profile").then((module) => ({ default: module.Profile }))
    ),

    [ROUTES.findFriend]: React.lazy(() =>
        import("./main/find-friend").then((module) => ({ default: module.FindFriend }))
    ),
} as const

export function AppRouter() {
    return (
        <Router history={history}>
            <Suspense fallback={<PageLoader />}>
                <Switch>
                    {/* public */}
                    {Object.keys(PUBLIC_CONFIG).map((path) => (
                        <Route
                            exact
                            key={path}
                            path={path}
                            component={(PUBLIC_CONFIG as any)[path]}
                        />
                    ))}

                    {/* main */}
                    {Object.keys(MAIN_CONFIG).map((path) => (
                        <ProtectedRoute
                            exact
                            key={path}
                            path={path}
                            component={(MAIN_CONFIG as any)[path]}
                        />
                    ))}

                    {/* onboarding */}
                    <ProtectedRoute
                        exact
                        path={ROUTES.onboarding}
                        component={
                            !localStorage.getItem(ONBOARDING_KEY)
                                ? React.lazy(() =>
                                      import("./main/onboarding").then((module) => ({
                                          default: module.OnBoarding,
                                      }))
                                  )
                                : () => <Redirect to={ROUTES.chats} />
                        }
                    />

                    {/* 404 */}
                    <Redirect to="/" />
                </Switch>
            </Suspense>
        </Router>
    )
}

const ProtectedRoute = (props: any) => {
    const isAuth = localStorage.getItem(AUTH_TOKEN)

    return isAuth ? isMobile() ? <Route {...props} /> : <DesktopWarning /> : <Redirect to="/" />
}

const generateRouteFromConfig = (config: any, isProtectedRoute: boolean) => {
    return Object.keys(config).map((path) => {
        const Component = isProtectedRoute ? ProtectedRoute : Route

        return <Component exact key={path} path={path} component={config[path]} />
    })
}

export const PublicRoutes = generateRouteFromConfig(PUBLIC_CONFIG, false)
export const OnboardingRoute = (
    <ProtectedRoute
        exact
        path={ROUTES.onboarding}
        component={
            !localStorage.getItem(ONBOARDING_KEY)
                ? React.lazy(() =>
                      import("./main/onboarding").then((module) => ({
                          default: module.OnBoarding,
                      }))
                  )
                : () => <Redirect to={ROUTES.chats} />
        }
    />
)
export const MainRoutes = generateRouteFromConfig(MAIN_CONFIG, true)
