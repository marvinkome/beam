import React, { useState, useEffect } from "react"
import Toast from "react-native-toast-message"
import { ImageSourcePropType } from "react-native"
import { useQuery, gql } from "@apollo/client"
import { ProfileView } from "./view"

export type ProfileType = {
    image: ImageSourcePropType
    name: string
    birthday: Date | undefined
    location: any
}

// HOOKS
function useProfile() {
    const [profile, setProfile] = useState<ProfileType>({
        image: {},
        name: "",
        birthday: undefined,
        location: null,
    })

    const setProfileData = (key: keyof ProfileType, value: any) => {
        setProfile({
            ...profile,
            [key]: value,
        })
    }

    const { data, error } = useQuery(
        gql`
            query GetUserDetails {
                me {
                    id
                    profile {
                        firstName
                        picture
                        location {
                            city
                            state
                        }
                    }
                }
            }
        `,
        { fetchPolicy: "cache-and-network" }
    )

    useEffect(() => {
        if (error?.networkError && !data) {
            // TODO:: sentry track error
            return Toast.show({ type: "error", text1: "Something went wrong", position: "bottom" })
        }

        setProfile({
            image: { uri: data.me.profile.picture },
            name: data.me.profile.firstName,
            birthday: undefined,
            location: data.me.profile.location,
        })
    }, [data, error])

    // continue when profile is all set
    useEffect(() => {
        const isProfileComplete =
            !!profile.image && !!profile.name && !!profile.birthday && !!profile.location
    }, [profile])

    return { profile, setProfileData }
}

export function Profile() {
    const { profile, setProfileData } = useProfile()

    // fetch current profile

    return <ProfileView profile={profile} setProfile={setProfileData} />
}
