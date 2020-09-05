import React from "react"
import { useSuggestedFriends, useInviteToChat } from "hooks"
import { Link } from "react-router-dom"
import { SuggestedFriendCard, ShareBox } from "components"
import "./style.scss"

function FriendAction(props: { friendId: string }) {
    const [invited, inviteToChat] = useInviteToChat()

    return invited ? (
        <button className="btn btn-primary-outline">Invite sent</button>
    ) : (
        <button onClick={() => inviteToChat(props.friendId)} className="btn btn-primary">
            Invite to chat
        </button>
    )
}

export function OnBoarding() {
    const { data } = useSuggestedFriends()
    const isEmpty = data?.suggestedFriends?.length === 0

    return (
        <div className="onboarding-page">
            <header>
                {isEmpty ? (
                    <h1>Sorry, but there aren't enough people in your location</h1>
                ) : (
                    <h1>Find a friend to chat with</h1>
                )}

                <p>
                    <Link to="/app/profile">Connect</Link> your Spotify and Reddit to get more
                    matches
                </p>
            </header>

            <div className="suggested-friends">
                {data?.suggestedFriends?.map((suggestedFriend: any) => (
                    <SuggestedFriendCard
                        key={suggestedFriend.friend.id}
                        suggestedFriend={suggestedFriend}
                        actions={<FriendAction friendId={suggestedFriend.friend.id} />}
                    />
                ))}
            </div>

            <div className="share-box">
                <div className="share-box-header">
                    <p>{isEmpty ? "Want to get matched?" : "Want to get more matches?"}</p>
                </div>

                <div className="share-box-content">
                    <ShareBox>Help us spread the word about Beam</ShareBox>
                </div>
            </div>
        </div>
    )
}
