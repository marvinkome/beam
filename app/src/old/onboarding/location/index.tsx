import React from "react"
import { LocationView } from "./view"
import { gql, useMutation } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import { Button } from "react-native"
import Toast from "react-native-toast-message"

export function Location() {
    const { navigate } = useNavigation()
    const [setLocation] = useMutation(gql`
        mutation SetLocation($location: LocationInput) {
            setLocation(location: $location) {
                id
                profile {
                    location {
                        state
                        city
                    }
                }
            }
        }
    `)

    const saveLocation = async (location: { lat: number; long: number }) => {
        try {
            await setLocation({ variables: { location } })

            // TODO:: track saved location event
            navigate("OnboardingConnect")
        } catch (e) {
            console.log(e)
            Toast.show({
                type: "error",
                text1: "Error saving location",
                text2: "Check your internet connection and try again",
                position: "bottom",
            })

            // TODO:: Sentry capture error
        }
        //
        //

        // // move to next step
        // console.log(location)
    }

    return <LocationView saveLocation={saveLocation} />
}
