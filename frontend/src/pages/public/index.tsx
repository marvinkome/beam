import React, { useEffect, Suspense } from "react"
import { Switch, Route, useHistory, useLocation } from "react-router-dom"
import { AUTH_TOKEN } from "lib/keys"
import { trackPageView } from "lib/analytics"
import { PageLoader } from "components/page-loader"

// pages
const LandingPage = React.lazy(() =>
    import("./landing-page").then((module) => ({
        default: module.LandingPage,
    }))
)

const InvitePage = React.lazy(() =>
    import("./invite").then((module) => ({
        default: module.InvitePage,
    }))
)

const PrivacyPolicy = React.lazy(() =>
    import("./privacy-policy").then((module) => ({
        default: module.PrivacyPolicy,
    }))
)

const Terms = React.lazy(() =>
    import("./terms").then((module) => ({
        default: module.Terms,
    }))
)

const AcceptableUse = React.lazy(() =>
    import("./acceptable-use").then((module) => ({
        default: module.AcceptableUse,
    }))
)

function UnauthRoute({ component: Component, ...rest }: any) {
    const history = useHistory()

    useEffect(() => {
        if (localStorage.getItem(AUTH_TOKEN)) {
            return history.push("/app/chats")
        }
    }, [history])

    return <Route {...rest} render={(props) => <Component {...rest} {...props} />} />
}

export function PublicPages() {
    const location = useLocation()
    useEffect(() => {
        if (location.pathname.includes("/invite/")) {
            trackPageView("/invite")
        } else {
            trackPageView(location.pathname)
        }
    }, [location.pathname])

    return (
        <Suspense fallback={<PageLoader />}>
            <Switch>
                <Route exact path="/invite/:inviteToken" component={InvitePage} />
                <Route exact path="/privacy-policy" component={PrivacyPolicy} />
                <Route exact path="/terms-and-condition" component={Terms} />
                <Route exact path="/acceptable-use" component={AcceptableUse} />
                <Route exact path="/oauth-redirect" component={() => <p>Connecting account</p>} />
                <UnauthRoute exact path="/" component={LandingPage} />
            </Switch>
        </Suspense>
    )
}
