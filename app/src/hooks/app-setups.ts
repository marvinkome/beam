import AsyncStorage from "@react-native-community/async-storage"
import { useEffect, useMemo, useState } from "react"
import { AUTH_TOKEN } from "libs/keys"
import { apolloSetup } from "libs/graphql"

export function useAppSetup() {
    const [isLoading, setLoading] = useState(true)
    const [isLoggedIn, setLoggedIn] = useState(false)
    const [apolloClient, setApolloClient] = useState<any>(null)

    useEffect(() => {
        // run async tasks
        const init = async () => {
            // check auth state
            const token = await AsyncStorage.getItem(AUTH_TOKEN)
            setLoggedIn(!!token)

            // setup apollo
            const { client, persistor } = await apolloSetup()

            // await persistor.restore()
            // if (__DEV__) await persistor.getLogs(true)

            setApolloClient(client)

            // stop loader
            setLoading(false)
        }

        init()
    }, [])

    const authContext = {
        signIn: () => setLoggedIn(true),
        signOut: () => setLoggedIn(false),
        isLoggedIn,
    }

    return {
        isLoading,
        isLoggedIn,
        apolloClient,
        authContext,
    }
}
