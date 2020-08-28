import React from "react"
import cls from "classnames"
import orderBy from "lodash.orderby"
import { formatDate } from "lib/helpers"
import { useQuery, gql } from "@apollo/client"
import { Link } from "react-router-dom"
import { useIntroJs } from "lib/hooks"

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

    useIntroJs({
        key: "done-group-intro",
        start: groups?.length < 1,
        steps: [
            {
                element: ".action-button-container",
                intro: "You can now join or create groups based on your interests",
                // @ts-ignore
                dynamic: true,
            },
            {
                element: "img.me",
                intro: "Click on your profile icon to find new groups",
                // @ts-ignore
                dynamic: true,
            },
        ],
    })

    if (loading) {
        return (
            <div className="loading-container">
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
                                {group.name} <span>{group.timestamp}</span>
                            </p>

                            <p className={cls({ isDefault: group.message.isDefault })}>
                                {group.message.text}
                            </p>
                        </div>
                    </Link>
                ))}
            </section>

            {!loading && groups.length < 1 && (
                <div className="action-button-container">
                    <Link className="btn btn-primary" to="/app/join-group">
                        Join a group
                    </Link>
                </div>
            )}
        </div>
    )
}
