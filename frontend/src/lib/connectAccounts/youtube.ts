import { useGoogleLogin, GoogleLoginResponse } from "react-google-login"
import { AxiosInstance } from "axios"
import { GOOGLE_CLIENT_ID } from "lib/keys"
import { setupAxios } from "lib/connectAccounts"
import { useConnectAccount } from "lib/hooks"
import { toast } from "react-toastify"
import { trackError } from "lib/GA"

let axiosInstance: AxiosInstance | undefined

async function makeYouTubeSubscriptionsRequest(pageToken: string | null = null) {
    try {
        const resp = await axiosInstance?.get("/subscriptions", {
            params: {
                part: "snippet,contentDetails",
                mine: true,
                key: GOOGLE_CLIENT_ID,
                maxResults: 100,
                ...(pageToken && { pageToken }),
            },
        })

        return resp?.data
    } catch (err) {
        return {}
    }
}

async function getYouTubeSubscriptions() {
    const subs = []
    let nextToken = null

    const { items, pageInfo, ...resp } = await makeYouTubeSubscriptionsRequest()
    nextToken = resp.nextPageToken

    for (let item of items) {
        subs.push({
            id: item.snippet.channelId,
            name: item.snippet.title,
        })
    }

    // go through total pages and repeat process
    while (nextToken) {
        // make subsequent requests
        const { items, pageInfo, ...resp } = (await makeYouTubeSubscriptionsRequest(
            nextToken
        )) as any
        nextToken = resp.nextPageToken

        // set subs
        for (let item of items) {
            subs.push({
                id: item.snippet.channelId,
                name: item.snippet.title,
            })
        }
    }

    return subs
}

export default function useYouTubeConnect(onCompleted: (completed: boolean) => void) {
    const connectAccount = useConnectAccount()

    const getUserData = async (res: any) => {
        const token = (res as GoogleLoginResponse).accessToken

        if (!token) {
            toast.error("Failed to connect your YouTube account. Please try again")
            trackError("Failed to connect with Youtube")
            onCompleted(false)
            return
        }

        axiosInstance = setupAxios("https://www.googleapis.com/youtube/v3/", token)
        const subs = await getYouTubeSubscriptions()

        const resp = await connectAccount({
            variables: {
                input: {
                    account: "youtube",
                    subs,
                },
            },
        })

        if (resp.data.connectAccount) {
            onCompleted(true)
        }
    }

    const { signIn } = useGoogleLogin({
        clientId: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        onSuccess: getUserData,
    })

    return [signIn]
}
