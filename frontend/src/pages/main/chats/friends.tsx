import React from "react"
import cls from "classnames"
import orderBy from "lodash.orderby"
import { useQuery, gql } from "@apollo/client"
import { getProfileImage, formatDate } from "lib/helpers"
import { Link } from "react-router-dom"
import { AddFriend } from "components/modals"
import { useIntroJs } from "hooks"
import { FiArrowRight } from "react-icons/fi"

function formatItems(friends: any[]) {
    const formattedFriends = orderBy(friends, "lastMessage.timestamp", "desc").reduce(
        (reduced, friend) => {
            let item = {
                id: friend.id,
                name: friend.profile.firstName,
                message: {
                    text: "Be the first to say hello",
                    isDefault: true,
                },
                timestamp: "",
                image: getProfileImage(friend.profile),
            }

            if (friend.lastMessage) {
                item = {
                    ...item,
                    message: {
                        text: friend.lastMessage.message,
                        isDefault: false,
                    },
                    timestamp: friend.lastMessage.timestamp,
                }
            }

            reduced.push(item)
            return reduced
        },
        []
    )

    return formattedFriends // orderBy(formattedFriends, "timestamp", "desc")
}

function useFriends() {
    const { data, loading } = useQuery(
        gql`
            query Friend {
                me {
                    id
                    requestsCount
                }
                friends {
                    id
                    lastMessage {
                        message
                        timestamp
                    }
                    profile {
                        firstName
                        name
                        picture
                    }
                }
            }
        `,
        { fetchPolicy: "cache-and-network" }
    )

    return { data, loading }
}

export function FriendsTab() {
    const { data, loading } = useFriends()
    const friends = formatItems(data?.friends || [])

    useIntroJs({
        key: "done-intro",
        start: data?.friends.length < 2,
        steps: [
            {
                element: ".action-button-container",
                intro: "To start chatting on Beam add your friend here",
                // @ts-ignore
                dynamic: true,
            },
            {
                element: "img.me",
                intro: "Click on your profile icon to see settings and find new friends",
                // @ts-ignore
                dynamic: true,
            },
        ],
    })

    if (loading && !data) {
        return (
            <div className="loading-container">
                <div className="loader" />
                <p>Loading friends. Please wait...</p>
            </div>
        )
    }

    return (
        <div className="tab friends-tab">
            {!!data?.me?.requestsCount && (
                <Link to="/app/invites" className="chat-invites">
                    <p>
                        View chat invite
                        <span>{data?.me?.requestsCount}</span>
                    </p>

                    <FiArrowRight className="icon" />
                </Link>
            )}

            <section className="chats-list">
                {friends.map((friend: any) => (
                    <Link to={`/app/chat/${friend.id}`} key={friend.id} className="chat-item">
                        <img alt={friend.name} src={friend.image} />

                        <div className="chat-details">
                            <p>
                                {friend.name}{" "}
                                <span>{formatDate(parseInt(friend.timestamp, 10))}</span>
                            </p>

                            <p className={cls({ isDefault: friend.message.isDefault })}>
                                {friend.message.text}
                            </p>
                        </div>
                    </Link>
                ))}
            </section>

            {!loading && friends.length < 2 && (
                <AddFriend
                    modalLocation="onboarding"
                    trigger={(toggle) => {
                        return (
                            <div className="action-button-container">
                                <button onClick={toggle} className="btn btn-primary">
                                    Invite a friend to Beam
                                </button>
                            </div>
                        )
                    }}
                />
            )}
        </div>
    )
}
