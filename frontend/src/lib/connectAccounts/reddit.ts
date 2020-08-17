import { AxiosInstance } from "axios"
import { REDDIT_CLIENT_ID, APP_URL } from "lib/keys"
import { setupAxios } from "lib/connectAccounts"
import { useRedditLogin, useConnectAccount } from "lib/hooks"
import { RedditResponseData } from "lib/hooks/redditLogin"
import { trackError } from "lib/GA"

// REDDIT API
let axiosInstance: AxiosInstance | undefined

async function makeRedditSubredditsRequest(after: string | null = null) {
    try {
        const resp = await axiosInstance?.get("/subreddits/mine/subscriber", {
            params: {
                limit: 10,
                ...(after && { after }),
            },
        })

        return resp?.data
    } catch (err) {
        return {}
    }
}

async function getSubreddits() {
    const subreddits = []
    let nextToken = null

    const { children, after } = (await makeRedditSubredditsRequest()).data
    nextToken = after

    for (let item of children) {
        subreddits.push({
            id: item.data.id,
            name: item.data.url.replace(/\/r\//, "").replace(/\/$/, ""),
        })
    }

    // go through total pages and repeat process
    while (nextToken !== null) {
        // make subsequent requests
        const { children, after } = (await makeRedditSubredditsRequest(nextToken)).data as any
        nextToken = after

        // set subreddits
        for (let item of children) {
            subreddits.push({
                id: item.data.id,
                name: item.data.url.replace(/\/r\//, "").replace(/\/$/, ""),
            })
        }
    }

    return subreddits
}

export default function useRedditConnect(onConnected: () => void) {
    const connectAccount = useConnectAccount()

    const getUserData = async (res: RedditResponseData) => {
        const token = res.access_token

        if (!token) {
            trackError("Failed to connect with Reddit")
        }

        axiosInstance = setupAxios("https://oauth.reddit.com", token)
        const subreddits = await getSubreddits()

        const resp = await connectAccount({
            variables: {
                input: {
                    account: "reddit",
                    subreddits,
                },
            },
        })

        if (resp.data.connectAccount) {
            onConnected()
        }
    }

    const signIn = useRedditLogin({
        clientId: REDDIT_CLIENT_ID,
        scope: "mysubreddits",
        redirectUri: `${APP_URL}/app/onboarding`,
        onSuccess: getUserData,
    })

    return [signIn]
}
