import { useRef, useEffect } from "react"
import { useQuery, gql } from "@apollo/client"
import { startLoader } from "components"

export function useSuggestedFriends() {
    const stopLoader = useRef<any>()

    const { data, loading } = useQuery(
        gql`
            {
                suggestedFriends {
                    friend {
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
                    sharedInterests {
                        name
                        platform
                    }
                }
            }
        `,
        {
            fetchPolicy: "network-only",
        }
    )

    useEffect(() => {
        if (loading && !data) {
            stopLoader.current = startLoader({
                type: "fullscreen",
                message: "Please wait while we find people nearby",
            })
        }

        if (!loading && data) {
            stopLoader.current && stopLoader.current()
        }
    }, [loading, data])

    return {
        data,
        loading,
    }
}
