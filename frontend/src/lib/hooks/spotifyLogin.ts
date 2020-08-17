import { toQuery } from "lib/helpers"
import PopupWindow from "lib/popupWindow"

export type SpotifyResponseData = {
    access_token: string
    token_type: string
    expires_in: string
}

export type SpotifyLoginOptions = {
    clientId: string
    scope: string
    redirectUri: string
    onSuccess: (data: SpotifyResponseData) => void
    onFailure?: (data: any) => void
}

export default function useSpotifyLogin(options: SpotifyLoginOptions) {
    const query = toQuery({
        client_id: options.clientId,
        response_type: "token",
        redirect_uri: encodeURIComponent(options.redirectUri),
        scope: options.scope,
    })

    const signIn = () => {
        PopupWindow.open("spotify-oauth-auth", `https://accounts.spotify.com/authorize?${query}`, {
            height: 800,
            width: 600,
        })
            ?.then((data: SpotifyResponseData) => options.onSuccess(data))
            .catch((err: any) => options.onFailure && options.onFailure(err))
    }

    return signIn
}
