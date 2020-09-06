import { useEffect, useState, useCallback } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import { useHistory } from "react-router-dom"
import { AUTH_TOKEN } from "lib/keys"
import { isMobile, getGeolocation } from "lib/helpers"
import { setUser } from "lib/analytics"

type Actions = "request-permission" | "redirect-to-public" | "render" | "render-desktop"

// All checks that needs to be ran each time a user opens the app
export function useAppSetup() {
    const [action, setAction] = useState<Actions | null>(null)
    const history = useHistory()

    // set location and cache user data
    const { data, loading } = useQuery(gql`
        {
            me {
                id
                email
                createdAt
                profile {
                    firstName
                    picture
                    location {
                        state
                        city
                    }
                }
            }
        }
    `)

    const [setLocation] = useMutation(gql`
        mutation SetLocation($location: LocationInput) {
            setLocation(location: $location) {
                id
            }
        }
    `)

    const getLocation = useCallback(async () => {
        try {
            const location = await getGeolocation()
            await setLocation({ variables: { location } })

            setAction("render")
        } catch (e) {
            return setAction("request-permission")
        }
    }, [setLocation])

    useEffect(() => {
        // 0 - we need to make sure it's mobile
        if (!isMobile()) {
            // if it's not mobile load the desktop app
            return setAction("render-desktop")
        }

        // 1 - we need to make sure the user has logged in
        if (!localStorage.getItem(AUTH_TOKEN)) {
            // if user hasn't logged in, redirect to landing page
            return setAction("redirect-to-public")
        }

        // 2 - we need to check if user has given permission
        if (!loading && data) {
            const { location } = data.me.profile
            if (!location || !location.state) {
                getLocation()
                return
            }

            setUser(data.me.id, {
                $email: data.me.email,
                signUpDate: new Date(parseInt(data?.me?.createdAt, 10)).toISOString(),
            })

            return setAction("render")
        }
    }, [history, setAction, getLocation, data, loading])

    return {
        action,
        getLocation,
    }
}
