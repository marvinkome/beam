import React, { useEffect } from "react"
import cls from "classnames"
import orderBy from "lodash.orderby"
import introJs from "intro.js"
import { useQuery, gql } from "@apollo/client"
import { getProfileImage, formatDate } from "lib/helpers"
import { Link } from "react-router-dom"
import { AddFriend } from "components/modals"

function formatItems(friends: any[]) {
    const formattedFriends = friends.reduce((reduced, friend) => {
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
                timestamp: formatDate(parseInt(friend.lastMessage.timestamp, 10)),
            }
        }

        reduced.push(item)
        return reduced
    }, [])

    return orderBy(formattedFriends, "timestamp", "desc")
}

function useFriends() {
    const { data, loading } = useQuery(
        gql`
            query Friend {
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

function useIntroJs(data: any) {
    useEffect(() => {
        if (window.localStorage.getItem("done-intro")) {
            return undefined
        }

        const intro = introJs()

        intro.onbeforechange(() => {
            // @ts-ignore
            const currentStepIdx = intro._currentStep

            // @ts-ignore
            const currentStepDynamic = !!intro._options.steps[currentStepIdx].dynamic

            if (currentStepDynamic) {
                // @ts-ignore
                const step = intro._options.steps[currentStepIdx]
                const element = document.querySelector(step.element)

                if (element) {
                    // @ts-ignore
                    const introItem = intro._introItems[currentStepIdx]
                    introItem.element = element
                    introItem.position = step.position
                }
            }
        })

        intro.oncomplete(() => {
            window.localStorage.setItem("done-intro", "true")
        })

        intro.setOptions({
            steps: [
                {
                    element: ".button-container",
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

        if (data?.friends.length < 2) {
            intro.start()
        }
    }, [data])
}

export function FriendsTab() {
    const { data, loading } = useFriends()
    const friends = formatItems(data?.friends || [])
    useIntroJs(data)

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading friends. Please wait...</p>
            </div>
        )
    }

    return (
        <div className="friends-tab">
            <section className="chats-list">
                {friends.map((friend: any) => (
                    <Link to={`/app/chat/${friend.id}`} key={friend.id} className="chat-item">
                        <img alt={friend.name} src={friend.image} />

                        <div className="chat-details">
                            <p>
                                {friend.name} <span>{friend.timestamp}</span>
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
                                    Add your first friend
                                </button>
                            </div>
                        )
                    }}
                />
            )}
        </div>
    )
}
