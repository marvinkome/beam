import React from "react"
import { Link } from "react-router-dom"
import { StackHeader, SuggestedFriendCard, ShareBox } from "components"
import { useSuggestedFriends, useInviteToChat } from "hooks"
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

export function FindFriend() {
    const { data } = useSuggestedFriends()
    const isEmpty = data?.suggestedFriends?.length === 0

    return (
        <div>
            <StackHeader title="Find a friend" />

            <div className="find-friend-page">
                <div className="page-header">
                    {isEmpty ? (
                        <h2>Sorry, but there aren't enough people in your location</h2>
                    ) : (
                        <h2>Find a friend to chat with</h2>
                    )}

                    <span>
                        <Link to="/app/profile">Connect</Link> your Spotify and Reddit to get more
                        matches
                    </span>
                </div>

                {isEmpty && (
                    <div className="share-box">
                        <div className="share-box-header">
                            <p>Want to get matched?</p>
                        </div>

                        <div className="share-box-content">
                            <ShareBox>Help us spread the word about Beam</ShareBox>
                        </div>
                    </div>
                )}

                <div className="suggested-friends">
                    {data?.suggestedFriends?.map((suggestedFriend: any) => (
                        <SuggestedFriendCard
                            key={suggestedFriend.friend.id}
                            suggestedFriend={suggestedFriend}
                            actions={<FriendAction friendId={suggestedFriend.friend.id} />}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
