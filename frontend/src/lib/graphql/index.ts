import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    // ApolloLink,
    from,
    split,
} from "@apollo/client"
import { WebSocketLink } from "@apollo/client/link/ws"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"
import { API_URL, AUTH_TOKEN, API_WS_URL } from "lib/keys"
// import { startLoader } from "components/loader"
import { getMainDefinition } from "@apollo/client/utilities"
import { history } from "lib/history"

// LINKS
// const loaderLink = new ApolloLink((operation, forward) => {
//     const loaderCompleteCb = startLoader()

//     return forward(operation).map((data) => {
//         loaderCompleteCb()
//         return data
//     })
// })

const logoutLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
        const err = graphQLErrors[0].message
        if (err === "Unauthenticated") {
            localStorage.removeItem(AUTH_TOKEN)
            history.push("/")
        }
    }
})

const networkLink = createHttpLink({
    uri: `${API_URL}/graphql`,
})

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem(AUTH_TOKEN)

    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    }
})

const httpLink = from([
    // loaderLink,
    authLink,
    logoutLink,
    networkLink,
])

const wsLink = new WebSocketLink({
    uri: `${API_WS_URL}/graphql`,
    options: {
        reconnect: true,
        connectionParams: {
            authToken: localStorage.getItem(AUTH_TOKEN),
        },
    },
})

const link = split(
    ({ query }) => {
        const def = getMainDefinition(query)
        return def.kind === "OperationDefinition" && def.operation === "subscription"
    },
    wsLink,
    httpLink
)

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

export const apolloClient = new ApolloClient({ link, cache })
