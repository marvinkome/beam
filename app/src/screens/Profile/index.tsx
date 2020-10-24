import React, { useState } from "react"
import Toast from "react-native-toast-message"
import { gql, useMutation, useQuery } from "@apollo/client"
import { ProfileScreen } from "./Profile"
import { Loader } from "components"
import { uploadImage } from "libs/storage"

const PROFILE_QUERY = gql`
    query ProfileQuery {
        me {
            id
            profile {
                firstName
                picture
            }
        }
    }
`

const SAVE_PICTURE = gql`
    mutation SavePicture($pictureUri: String!) {
        setProfilePicture(pictureUri: $pictureUri) {
            id
            profile {
                picture
            }
        }
    }
`

function useProfileData() {
    const { data, loading } = useQuery(PROFILE_QUERY, { fetchPolicy: "cache-and-network" })

    return {
        profile: data?.me?.profile,
        loading,
    }
}

function useSavePicture() {
    const [savingPicture, setSavingPicture] = useState(false)
    const [savePicture] = useMutation(SAVE_PICTURE)

    return {
        onSavePicture: async (file: string, userName: string) => {
            setSavingPicture(true)

            try {
                const downloadUrl = await uploadImage({
                    name: `${userName}-${Date.now()}`,
                    uri: file,
                })

                await savePicture({
                    variables: { pictureUri: downloadUrl },
                })
            } catch (e) {
                console.log(e)
                Toast.show({ type: "error", text1: "Error uploading image", position: "bottom" })
            }

            setSavingPicture(false)
        },
        savingPicture,
    }
}

export function Profile() {
    const { loading, profile } = useProfileData()
    const { savingPicture, onSavePicture } = useSavePicture()

    if (loading && !profile) {
        return <Loader />
    }

    return (
        <ProfileScreen
            profile={profile}
            onChangePicture={(file) => onSavePicture(file, profile.firstName)}
            savingPicture={savingPicture}
        />
    )
}
