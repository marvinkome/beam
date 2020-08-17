import { toQuery } from "lib/helpers"
import PopupWindow from "lib/popupWindow"

export type RedditResponseData = {
    access_token: string
    token_type: string
    state: string
    expires_in: string
    scope: string
}

export type RedditLoginOptions = {
    clientId: string
    scope: string
    redirectUri: string
    onSuccess: (data: RedditResponseData) => void
    onFailure?: (data: any) => void
}

export default function useRedditLogin(options: RedditLoginOptions) {
    const query = toQuery({
        client_id: options.clientId,
        response_type: "token",
        state: "ranDomsPacestAte",
        redirect_uri: encodeURIComponent(options.redirectUri),
        scope: options.scope,
    })

    const signIn = () => {
        PopupWindow.open(
            "reddit-oauth-auth",
            `https://www.reddit.com/api/v1/authorize.compact?${query}`,
            {
                height: 800,
                width: 600,
            }
        )
            ?.then((data: any) => options.onSuccess(data))
            .catch((err: any) => options.onFailure && options.onFailure(err))
    }

    return signIn
}
