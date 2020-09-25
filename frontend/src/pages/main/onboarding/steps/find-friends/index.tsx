import React from "react"
import { useSuggestedFriends, useInviteToChat } from "hooks"
import { FiCheck } from "react-icons/fi"
import { Link } from "react-router-dom"
import { SuggestedFriendCard } from "components"
import "./style.scss"

function FriendAction(props: { friendId: string }) {
    const [invited, inviteToChat] = useInviteToChat()

    return invited ? (
        <button className="btn btn-primary-outline">
            Invite sent <FiCheck className="icon" />
        </button>
    ) : (
        <button onClick={() => inviteToChat(props.friendId)} className="btn btn-primary">
            Invite to chat
        </button>
    )
}

export function FindFriends() {
    const { data } = useSuggestedFriends()
    const isEmpty = data?.suggestedFriends?.length === 0

    return (
        <div className="find-friends-page">
            <header className="page-header">
                {isEmpty ? (
                    <h1>Sorry, we can't find a match in your location</h1>
                ) : (
                    <h1>Send an invite to chat</h1>
                )}

                <p>
                    <Link to="/app/profile">Connect</Link> all your accounts to get more matches
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

            {isEmpty ? (
                <Link to="/app/profile" className="btn btn-primary">
                    Connect more accounts
                </Link>
            ) : (
                <Link to="/app/chats" className="btn btn-primary">
                    Continue to chats
                </Link>
            )}
        </div>
    )
}
