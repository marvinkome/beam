import { useRef, useEffect, useState } from "react"
import { useQuery, gql, useMutation } from "@apollo/client"
import { startLoader } from "components"
import { toast } from "react-toastify"
import { trackEvent } from "lib/analytics"

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
                        image
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
            stopLoader.current = startLoader(
                "fullscreen",
                "Please wait while we find people nearby"
            )
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

export function useInviteToChat(): [boolean, (matchId: string) => void] {
    const [invited, setInviteStatus] = useState(false)
    const [sendFriendRequest] = useMutation(gql`
        mutation SendFriendRequest($matchId: ID!) {
            sendFriendRequest(matchId: $matchId)
        }
    `)

    return [
        invited,
        async (matchId: string) => {
            const { data } = await sendFriendRequest({ variables: { matchId } })

            if (!data.sendFriendRequest) {
                return toast.dark("Error sending invite. Try Again")
            }

            trackEvent("Sent invite", { category: "Find Friend" })
            setInviteStatus(true)
        },
    ]
}
