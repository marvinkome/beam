import React, { useEffect } from "react"
import { useQuery, gql, useMutation } from "@apollo/client"
import { ShareBeam } from "components/modals"
import { useHistory } from "react-router-dom"
import { trackPageView, trackEvent } from "lib/analytics"
import { SuggestedFriendCard } from "components/suggestedFriendCard/index-o"
import "./style.scss"

function useData() {
    const { data: profileData } = useQuery(
        gql`
            {
                me {
                    profile {
                        location {
                            city
                            state
                        }
                    }
                }
            }
        `,
        {
            fetchPolicy: "cache-and-network",
        }
    )

    const { data, loading } = useQuery(
        gql`
            {
                suggestedFriend {
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

    return {
        profileData,
        data,
        loading,
    }
}

function useContinueToChat(suggestedFriend: any) {
    const history = useHistory()
    const [addFriend] = useMutation(gql`
        mutation AddFriend($friend: ID!) {
            addFriendById(friendId: $friend)
        }
    `)

    const onContinueToChat = async () => {
        if (!suggestedFriend?.friend) {
            // continue to chats
            return history.push("/app/chats")
        }

        trackEvent("Found match", { category: "Friend Matching", label: "onboarding" })
        const { data } = await addFriend({
            variables: {
                friend: suggestedFriend.friend.id,
            },
        })

        if (data.addFriendById) {
            // continue to chat
            history.push(`/app/chat/${suggestedFriend.friend.id}`)
        }
    }

    return onContinueToChat
}

export function SuggestedFriends() {
    useEffect(() => trackPageView("suggest-friend"), [])
    const { loading, data, profileData } = useData()
    const onContinueToChat = useContinueToChat(data?.suggestedFriend)

    if (loading) {
        return (
            <div className="suggestion-page loading">
                <div className="page-header">
                    <h1>Please wait while we search for a friend</h1>
                </div>

                <div className="page-content">
                    <div className="loader"></div>

                    {profileData && (
                        <p className="location">
                            You're in {profileData?.me.profile.location.city},{" "}
                            {profileData?.me.profile.location.state}
                        </p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="suggestion-page">
            {data?.suggestedFriend ? (
                <section>
                    <header className="page-header">
                        <h1>We found someone you might find interesting</h1>
                    </header>

                    <div className="page-content">
                        <SuggestedFriendCard suggestedFriend={data.suggestedFriend} />
                    </div>
                </section>
            ) : (
                <section>
                    <header className="page-header">
                        <h1>There aren't enough Beam users near you to get a match</h1>
                        <p>For now, invite your close friends to start chatting.</p>
                    </header>

                    <div className="page-content share-container">
                        <p>
                            Want to get matched with someone faster? Help us spread the word about
                            Beam.
                        </p>

                        <ShareBeam
                            modalLocation="suggest-friend-onboarding"
                            trigger={(toggle) => (
                                <div onClick={toggle} className="share-box">
                                    <span>Tell others about Beam</span>
                                    <img alt="" src={require("assets/images/share.png")} />
                                </div>
                            )}
                        />
                    </div>
                </section>
            )}

            <button onClick={onContinueToChat} className="btn btn-primary">
                Continue to chat
            </button>
        </div>
    )
}
