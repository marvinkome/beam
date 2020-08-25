import React from "react"
import cls from "classnames"
import orderBy from "lodash.orderby"
import { formatDate } from "lib/helpers"
import { useQuery, gql } from "@apollo/client"
import { Link } from "react-router-dom"

function formatItems(groups: any[]) {
    const formattedGroups = groups.reduce((reduced, group) => {
        let item = {
            id: group.id,
            name: group.name,
            message: {
                text: "Click to enter group",
                isDefault: true,
            },
            timestamp: "",
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
    }, [])

    return orderBy(formattedGroups, "timestamp", "desc")
}

function useGroups() {
    const { data, loading } = useQuery(
        gql`
            query Groups {
                groups {
                    id
                    name
                    image
                    lastMessage {
                        message
                        timestamp
                    }
                }
            }
        `,
        { fetchPolicy: "cache-and-network" }
    )

    return { data, loading }
}

export function GroupsTab() {
    const { data, loading } = useGroups()
    const groups = formatItems(data?.groups || [])

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading groups. Please wait...</p>
            </div>
        )
    }

    return (
        <div className="groups-tab">
            <section className="chats-list">
                {groups.map((group: any) => (
                    <Link to={`/app/group/${group.id}`} key={group.id} className="chat-item">
                        <img alt={group.name} src={group.image} />

                        <div className="chat-details">
                            <p>
                                {group.name} <span>{group.timestamp}</span>
                            </p>

                            <p className={cls({ isDefault: group.message.isDefault })}>
                                {group.message.text}
                            </p>
                        </div>
                    </Link>
                ))}
            </section>
        </div>
    )
}
