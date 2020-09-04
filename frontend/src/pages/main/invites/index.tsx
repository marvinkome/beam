import React, { useRef, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useHistory } from "react-router-dom"
import { useQuery, gql, useMutation } from "@apollo/client"
import { StackHeader, startLoader, SuggestedFriendCard } from "components"
import "./style.scss"

function useChatInvites() {
    const stopLoader = useRef<any>()

    const { data, loading } = useQuery(
        gql`
            {
                me {
                    id
                    requests {
                        from {
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
                        date
                        sharedInterests {
                            name
                            image
                            platform
                        }
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
            stopLoader.current = startLoader("fullscreen", "Fetching invites")
        }

        if (!loading && data) {
            stopLoader.current && stopLoader.current()
        }
    }, [loading, data])

    return {
        data: data?.me?.requests,
    }
}

function useInviteAction(): [boolean | null, (matchId: string, accepted: boolean) => void] {
    const [declined, setDeclined] = useState<boolean | null>(null)
    const history = useHistory()
    const [respondToInvite] = useMutation(gql`
        mutation RespondToFriendRequest($matchId: ID!, $accepted: Boolean!) {
            respondToFriendRequest(matchId: $matchId, accepted: $accepted)
        }
    `)

    return [
        declined,

        async (matchId: string, accepted: boolean) => {
            const { data } = await respondToInvite({ variables: { matchId, accepted } })

            if (!data.respondToFriendRequest) {
                return toast.dark(`Error ${accepted ? "accepting" : "rejecting"} invite. Try Again`)
            }

            if (accepted) {
                return history.push(`/app/chat/${matchId}`)
            } else {
                setDeclined(true)
            }
        },
    ]
}

function FriendAction(props: { friendId: string }) {
    const [declined, respondToInvite] = useInviteAction()

    if (declined !== null && declined) {
        return <button className="btn btn-primary-outline">Invitation declined</button>
    }

    return (
        <>
            <button
                onClick={() => respondToInvite(props.friendId, true)}
                className="btn btn-primary"
            >
                Accept
            </button>
            <button
                onClick={() => respondToInvite(props.friendId, false)}
                className="btn btn-primary-outline"
            >
                Decline
            </button>
        </>
    )
}

export function FriendInvites() {
    const { data } = useChatInvites()
    const isEmpty = data?.length === 0

    return (
        <div>
            <StackHeader title="Chat Invites" />

            <div className="invites-page">
                <div className="page-header">
                    <h2>
                        {isEmpty ? "You have no invites" : "These people want to chat with you"}
                    </h2>
                </div>

                <div className="invites">
                    {data?.map((request: any) => (
                        <SuggestedFriendCard
                            key={request.from.id}
                            suggestedFriend={{
                                ...request,
                                friend: request.from,
                            }}
                            actions={<FriendAction friendId={request.from.id} />}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
