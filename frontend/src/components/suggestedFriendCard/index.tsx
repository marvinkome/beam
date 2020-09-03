import React, { useState } from "react"
import "./style.scss"

export function useInterestsPagination(interests: any[]) {
    const steps = 16
    const [currentChunk, setCurrentChunk] = useState(0) // store current chunk

    return {
        interests: interests.slice(currentChunk * steps, steps * (currentChunk + 1)),
        loadMore: () => {
            setCurrentChunk((currentChunk + 1) * steps < interests.length ? currentChunk + 1 : 0)
        },
    }
}

type IProps = {
    suggestedFriend?: {
        friend: any
        sharedInterests: any[]
    }
}
export function SuggestedFriendCard(props: IProps) {
    const { friend, sharedInterests } = props.suggestedFriend!
    const { interests, loadMore } = useInterestsPagination(sharedInterests)

    return (
        <div className="suggested-friend-card">
            <div className="card-header">
                <img
                    src={friend.profile.picture || require("assets/images/beambot.png")}
                    alt={friend.profile.firstName}
                />

                <div>
                    <p>{friend.profile.firstName}</p>
                    <span>
                        Lives in{" "}
                        {friend.profile.location.city ? `${friend.profile.location.city},` : ""}{" "}
                        {friend.profile.location.state}
                    </span>
                </div>
            </div>

            <div className="shared-interests">
                <p>You both share {sharedInterests.length} interests</p>

                <ul>
                    {interests.map((interest, id) => {
                        let image = interest.image

                        if (!image) {
                            interest.platform === "youtube" &&
                                (image = require(`assets/images/youtube.png`))

                            interest.platform === "reddit" &&
                                (image = require(`assets/images/reddit.png`))

                            interest.platform.split("_")[0] === "spotify" &&
                                (image = require(`assets/images/spotify.png`))
                        }

                        return (
                            <li key={id}>
                                <img alt={interest.platform} src={image} />

                                <span>{interest.name}</span>
                            </li>
                        )
                    })}
                </ul>

                {sharedInterests.length > 16 && (
                    <button onClick={loadMore} className="btn">
                        See More
                    </button>
                )}
            </div>

            <div className="card-footer">
                <button className="btn btn-primary">Accept</button>

                <button className="btn btn-primary-outline">Decline</button>
            </div>
        </div>
    )
}
