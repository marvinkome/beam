import axios, { AxiosInstance } from "axios"
import { startLoader } from "components/loader"
import { GOOGLE_CLIENT_ID } from "./keys"

class ConnectAccount {
    private accessToken: string
    baseUrl: string
    axios?: AxiosInstance

    constructor(accessToken: string, baseUrl: string) {
        this.accessToken = accessToken
        this.baseUrl = baseUrl
        this.setupAxios()
    }

    private setupAxios() {
        this.axios = axios.create({
            baseURL: this.baseUrl,
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Accept: "application/json",
            },
        })

        let loaderCompleteCb: () => void

        this.axios.interceptors.request.use((config) => {
            loaderCompleteCb = startLoader()

            return config
        })

        this.axios.interceptors.response.use(
            (response) => {
                loaderCompleteCb()

                return response
            },
            (error) => {
                loaderCompleteCb()
                return error
            }
        )
    }
}

export class ConnectYoutubeAccount extends ConnectAccount {
    constructor(accessToken: string) {
        super(accessToken, "https://www.googleapis.com/youtube/v3/")
    }

    async getSubscriptions() {
        const subs = []
        let nextToken = null

        const { items, pageInfo, ...resp } = await this.makeSubscriptionsRequest()
        nextToken = resp.nextPageToken

        for (let item of items) {
            subs.push({
                id: item.snippet.resourceId.channelId,
                name: item.snippet.title,
                image: item.snippet.thumbnails.default.url,
            })
        }

        // go through total pages and repeat process
        while (nextToken) {
            // make subsequent requests
            const { items, pageInfo, ...resp } = (await this.makeSubscriptionsRequest(
                nextToken
            )) as any
            nextToken = resp.nextPageToken

            // set subs
            for (let item of items) {
                subs.push({
                    id: item.snippet.resourceId.channelId,
                    name: item.snippet.title,
                    image: item.snippet.thumbnails.default.url,
                })
            }
        }

        return subs
    }

    private async makeSubscriptionsRequest(pageToken: string | null = null) {
        try {
            const resp = await this.axios?.get("/subscriptions", {
                params: {
                    part: "snippet",
                    mine: true,
                    key: GOOGLE_CLIENT_ID,
                    maxResults: 150,
                    ...(pageToken && { pageToken }),
                },
            })

            return resp?.data
        } catch (err) {
            return {}
        }
    }
}

export class ConnectRedditAccount extends ConnectAccount {
    constructor(accessToken: string) {
        super(accessToken, "https://oauth.reddit.com")
    }

    async getSubreddits() {
        const subreddits = []
        let nextToken = null

        const { children, after } = (await this.makeSubredditsRequest()).data
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
            const { children, after } = (await this.makeSubredditsRequest(nextToken)).data as any
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

    private async makeSubredditsRequest(after: string | null = null) {
        try {
            const resp = await this.axios?.get("/subreddits/mine/subscriber", {
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
}

export class ConnectSpotifyAccount extends ConnectAccount {
    constructor(accessToken: string) {
        super(accessToken, "https://api.spotify.com/v1")
    }

    async getTopArtistsAndGenres() {
        const artists = []
        const genres = new Set<string>()
        let next = null

        const { items, ...resp } = await this.makeTopArtistsRequest()
        next = resp.next

        for (let item of items) {
            artists.push({
                id: item.id,
                name: item.name,
            })

            item.genres.forEach((genre: string) => genres.add(genre))
        }

        // go through total pages and repeat process
        while (next) {
            // make subsequent requests
            const { items, pageInfo, ...resp } = (await this.makeTopArtistsRequest(next)) as any
            next = resp.next

            // set subs
            for (let item of items) {
                artists.push({
                    id: item.id,
                    name: item.name,
                })

                item.genres.forEach((genre: string) => genres.add(genre))
            }
        }

        return { artists, genres: Array.from(genres) }
    }

    private async makeTopArtistsRequest(link: string | null = null) {
        try {
            const resp = await this.axios?.get(link || "/me/top/artists")
            return resp?.data
        } catch (err) {
            return {}
        }
    }
}
