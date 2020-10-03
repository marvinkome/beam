import AsyncStorage from "@react-native-community/async-storage"
import Toast from "react-native-toast-message"
import { useState, useContext } from "react"
import { GoogleSignin, statusCodes, User } from "@react-native-community/google-signin"
import { useMutation, gql } from "@apollo/client"
import { AUTH_TOKEN } from "libs/keys"
import { AuthContext } from "libs/auth-context"

type AuthOptions = {
    inviteToken?: string
}
export function useGoogleAuth(options?: AuthOptions) {
    const authContext = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [loginMutation] = useMutation(gql`
        mutation Login($data: LoginInput, $inviteToken: String) {
            login(authData: $data, inviteToken: $inviteToken) {
                success
                message
                token
                user {
                    id
                    email
                    createdAt
                }
            }
        }
    `)

    const signIn = async () => {
        // TODO:: handle analytics - send click event
        // TODO:: sentry breadcrumb - request started

        let userInfo: User | null = null

        // login with google to get user info
        try {
            await GoogleSignin.hasPlayServices()
            userInfo = await GoogleSignin.signIn()
        } catch (err) {
            let error = "Something went wrong"
            if (err.code === statusCodes.SIGN_IN_CANCELLED) {
                error = "Please sign in to continue"
            } else if (err.code === statusCodes.IN_PROGRESS) {
                error = "Already signing in"
            } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                error = "Play service required to sign in"
            }

            // TODO:: add sentry capture - capture error
            return Toast.show({ text1: error, type: "error", position: "bottom" })
        }

        if (!userInfo) {
            return Toast.show({ text1: "Failed to sign in", type: "error", position: "bottom" })
        }

        // TODO:: sentry breadcrumb - google signin successful

        // authenticate user on our server
        setLoading(true)
        const loginResp = await loginMutation({
            variables: {
                inviteToken: options?.inviteToken,
                data: {
                    authType: "googleId",
                    id: userInfo.user.id,
                    email: userInfo.user.email,
                    name: userInfo.user.givenName,
                    picture: userInfo.user.photo,
                },
            },
        })

        const { token, success, message, user } = loginResp.data?.login
        if (!success) {
            // TODO:: sentry capture error - server login failed

            return Toast.show({
                text1: "Failed to sign in",
                text2: message,
                type: "error",
                position: "bottom",
            })
        }

        // setup user
        await AsyncStorage.setItem(AUTH_TOKEN, token)

        // TODO:: Add user to analytics
        // TODO:: Track succesful event

        setLoading(false)
        return authContext.signIn()
    }

    return {
        loading,
        signIn,
    }
}
