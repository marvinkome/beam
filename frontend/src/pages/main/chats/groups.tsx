import React, { useEffect } from "react"
import cls from "classnames"
import orderBy from "lodash.orderby"
import { formatDate } from "lib/helpers"
import { useQuery, gql } from "@apollo/client"
import { Link } from "react-router-dom"

function formatItems(groups: any[]) {
    const formattedGroups = orderBy(groups, "lastMessage.timestamp", "desc").reduce(
        (reduced, group) => {
            let item = {
                id: group.id,
                name: group.name,
                message: {
                    text: "Click to enter group",
                    isDefault: true,
                },
                timestamp: "",
                unreadCount: group.unreadCount,
                image: group.image,
            }

            if (group.lastMessage) {
                item = {
                    ...item,
                    message: {
                        text: group.lastMessage.message,
                        isDefault: false,
                    },
                    timestamp: formatDate(parseInt(group.lastMessage.timestamp, 10)),
                }
            }

            reduced.push(item)
            return reduced
        },
        []
    )

    return formattedGroups
}

function useGroups() {
    const { data, loading, subscribeToMore } = useQuery(
        gql`
            query Groups {
                groups {
                    id
                    name
                    image
                    unreadCount
                    lastMessage {
                        message
                        timestamp
                    }
                }
            }
        `,
        { fetchPolicy: "cache-and-network" }
    )

    // subscribe to new messages
    useEffect(() => {
        const MESSAGE_SUB = gql`
            subscription Messages {
                messageSent(shouldNotFilter: true) {
                    id
                    message
                    timestamp
                    to {
                        ... on Group {
                            id
                        }
                    }
                }
            }
        `

        subscribeToMore({
            document: MESSAGE_SUB,
            updateQuery: (data: any, { subscriptionData }: any) => {
                if (!subscriptionData.data) return data

                const newMessage = subscriptionData.data.messageSent

                const newGroupsData = data.groups.map((group: any) => {
                    if (group.id !== newMessage.to.id) return group

                    // update group
                    return {
                        ...group,
                        unreadCount: group.unreadCount + 1,
                        lastMessage: newMessage,
                    }
                })

                // update group
                return {
                    ...data,
                    groups: newGroupsData,
                }
            },
        })
    }, [subscribeToMore])

    return { data, loading }
}

export function GroupsTab() {
    const { data, loading } = useGroups()
    const groups = formatItems(data?.groups || [])

    if (loading && !data) {
        return (
            <div className="loading-container">
                <div className="loader" />
                <p>Loading groups. Please wait...</p>
            </div>
        )
    }

    return (
        <div className="tab groups-tab">
            <section className="chats-list">
                {groups.map((group: any) => (
                    <Link to={`/app/group/${group.id}`} key={group.id} className="chat-item">
                        <img alt={group.name} src={group.image} />

                        <div className="chat-details">
                            <p>
                                <span className="name">{group.name} </span>
                                <span className="date">{group.timestamp}</span>
                            </p>

                            <p className={cls({ isDefault: group.message.isDefault })}>
                                <span>{group.message.text}</span>
                                {!!group.unreadCount && (
                                    <span className="unread-count">{group.unreadCount}</span>
                                )}
                            </p>
                        </div>
                    </Link>
                ))}
            </section>

            {!loading && groups.length < 1 && (
                <div className="action-button-container">
                    <Link className="btn btn-primary" to="/app/join-group">
                        Find your first group
                    </Link>
                </div>
            )}
        </div>
    )
}
