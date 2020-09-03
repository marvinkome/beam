import React from "react"
import { Link } from "react-router-dom"
import { StackHeader, SuggestedFriendCard, ShareBox } from "components"
import { useSuggestedFriends } from "hooks"
import "./style.scss"

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
                        <h2>Send an invite to chat</h2>
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
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
