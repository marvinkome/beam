import React, { useMemo } from "react"
import _shuffle from "lodash.shuffle"
import "./style.scss"

function getSharedInterests(interests: any[]) {
    const youtubeInterests = interests
        .filter((interest) => interest.platform === "youtube")
        .slice(0, 15)
    const redditInterests = interests
        .filter((interest) => interest.platform === "reddit")
        .slice(0, 15)
    const spotifyArtistInterests = interests
        .filter((interest) => interest.platform === "spotify_artist")
        .slice(0, 15)
    const spotifyGenreInterests = interests
        .filter((interest) => interest.platform === "spotify_genre")
        .slice(0, 3)

    return _shuffle([
        ...youtubeInterests,
        ...redditInterests,
        ...spotifyGenreInterests,
        ...spotifyArtistInterests,
    ]).slice(0, 10)
}

type IProps = {
    suggestedFriend?: {
        friend: any
        sharedInterests: any[]
    }
}

export function SuggestedFriendCard(props: IProps) {
    const { friend, sharedInterests } = props.suggestedFriend!
    const interests = useMemo(() => getSharedInterests(sharedInterests), [sharedInterests])

    return (
        <div className="suggested-friend-card">
            <div className="card-header">
                <img src={friend.profile.picture} alt="Lenny" />
                <div>
                    <p>{friend.profile.firstName}</p>
                    <span>
                        Lives in {friend.profile.location.city}, {friend.profile.location.state}
                    </span>
                </div>
            </div>

            <div className="shared-interests">
                <h2>You both share {sharedInterests.length} interests</h2>

                <p>Here are {interests.length} of those:</p>
                <ul>
                    {interests.map((interest, id) => (
                        <li key={id}>
                            {interest.platform === "youtube" && (
                                <img
                                    alt={interest.platform}
                                    src={require(`assets/images/youtube.png`)}
                                />
                            )}

                            {interest.platform === "reddit" && (
                                <img
                                    alt={interest.platform}
                                    src={require(`assets/images/reddit.png`)}
                                />
                            )}

                            {interest.platform.split("_")[0] === "spotify" && (
                                <img
                                    alt={interest.platform}
                                    src={require(`assets/images/spotify.png`)}
                                />
                            )}

                            {interest.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
