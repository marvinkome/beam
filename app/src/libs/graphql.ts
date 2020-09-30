import AsyncStorage from "@react-native-community/async-storage"
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
    NormalizedCacheObject,
} from "@apollo/client"
import { CachePersistor, PersistentStorage } from "apollo3-cache-persist"
import { onError } from "@apollo/client/link/error"
import { setContext } from "@apollo/client/link/context"
import { AUTH_TOKEN, API_URL } from "./keys"
import { navigate, routesName } from "./navigator"
import { PersistedData } from "apollo3-cache-persist/lib/types"

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

    const client = new ApolloClient({
        link: httpLink,
        cache,
    })

    return { persistor, client }
}
