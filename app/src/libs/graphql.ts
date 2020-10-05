import AsyncStorage from "@react-native-community/async-storage"
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
    NormalizedCacheObject,
    split,
} from "@apollo/client"
import { WebSocketLink } from "@apollo/client/link/ws"
import { CachePersistor, PersistentStorage } from "apollo3-cache-persist"
import { onError } from "@apollo/client/link/error"
import { setContext } from "@apollo/client/link/context"
import { AUTH_TOKEN, API_URL, API_WS_URL } from "./keys"
import { navigate, routesName } from "./navigator"
import { PersistedData } from "apollo3-cache-persist/lib/types"
import { getMainDefinition } from "@apollo/client/utilities"

export async function apolloSetup() {
    // LINKS
    const errorLink = onError(({ graphQLErrors }) => {
        if (graphQLErrors) {
            const err = graphQLErrors[0].message
            if (err === "Unauthenticated") {
                AsyncStorage.removeItem(AUTH_TOKEN).then(() => {
                    navigate(routesName.LandingPage)
                })
            }
        }
    })

    // TODO: Retry link

    const networkLink = createHttpLink({
        uri: `${API_URL}/graphql`,
    })

    const authLink = setContext(async (_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = await AsyncStorage.getItem(AUTH_TOKEN)

        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
            },
        }
    })

    // HTTP LINK
    const httpLink = from([authLink, errorLink, networkLink])

    // WEBSOCKET LINK
    const wsLink = new WebSocketLink({
        uri: `${API_WS_URL}/graphql`,
        options: {
            reconnect: true,
            connectionParams: async () => {
                const authToken = await AsyncStorage.getItem(AUTH_TOKEN)
                return { authToken }
            },
        },
    })

    const link = split(
        ({ query }) => {
            const definition = getMainDefinition(query)
            return (
                definition.kind === "OperationDefinition" && definition.operation === "subscription"
            )
        },
        wsLink,
        httpLink
    )

    // CACHE
    const cache = new InMemoryCache({
        typePolicies: {
            User: {
                fields: {
                    profile: {
                        merge(existing, incoming) {
                            return { ...existing, ...incoming }
                        },
                    },
                },
            },
        },
    })

    const persistor = new CachePersistor({
        cache,
        storage: AsyncStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>,
        maxSize: false,
        debug: __DEV__,
    })

    const client = new ApolloClient({ link, cache })

    return { persistor, client }
}
