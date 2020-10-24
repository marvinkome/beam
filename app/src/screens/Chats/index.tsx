import React from "react"
import orderBy from "lodash.orderby"
import { gql, useQuery } from "@apollo/client"
import { ChatsScreen } from "./Chats"
import { Loader } from "components"
import { formatDate } from "libs/helpers"

const ME_FRIENDS_QUERY = gql`
    query Friends {
        me {
            profile {
                picture
            }
        }

        friends {
            id
            unreadCount
            lastMessage {
                message
                timestamp
            }
            profile {
                firstName
                picture
            }
        }
    }
`

function useFriends() {
    const { data, loading } = useQuery(ME_FRIENDS_QUERY, { fetchPolicy: "cache-and-network" })
    return {
        profile: data?.me?.profile as { picture: string },
        friends: data?.friends as any[],
        loading,
    }
}

export function Chats() {
    const { friends, profile, loading } = useFriends()

    if (!friends && loading) {
        return <Loader />
    }

    const formattedFriendsData = orderBy(friends, "lastMessage.timestamp", "desc").reduce(
        (allFriends, friend) => {
            let item = {
                id: friend.id,
                name: friend.profile.firstName,
                message: { text: "" },
                timestamp: "",
                unreadCount: friend.unreadCount,
                image: friend.profile.picture,
            }

            if (friend.lastMessage) {
                item = {
                    ...item,
                    message: {
                        text: friend.lastMessage.message,
                    },
                    timestamp: formatDate(friend.lastMessage.timestamp),
                }
            }

            allFriends.push(item)
            return allFriends
        },
        []
    )

    return <ChatsScreen profile={profile} friends={formattedFriendsData} />
}
