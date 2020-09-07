import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { StackHeader } from "components/header"
import { FiX } from "react-icons/fi"
import { useQuery, gql, useMutation } from "@apollo/client"
import { useYouTubeConnect, useRedditConnect, useSpotifyConnect } from "hooks"
import { trackEvent } from "lib/analytics"
import "./style.scss"

function useConnectAccountAndProfile() {
    const [showingSearchPrompt, showSearchPrompt] = useState(false)
    const [connectedAccounts, setConnectedAccounts] = useState({
        youtube: false,
        spotify: false,
        reddit: false,
    })

    const [profile, setProfile] = useState<any>(null)

    // fetch connected accounts
    const { data, loading } = useQuery(
        gql`
            {
                me {
                    id
                    connectedAccounts {
                        reddit
                        spotify
                        youtube
                    }

                    profile {
                        firstName
                        picture
                        location {
                            city
                            state
                        }
                    }
                }
            }
        `,
        { fetchPolicy: "cache-and-network" }
    )

    // add connected accounts to state
    useEffect(() => {
        if (data?.me) {
            setConnectedAccounts(data.me.connectedAccounts)
            setProfile(data.me.profile)
        }
    }, [data])

    // disconnect accounts
    const [disconnectAccount] = useMutation(
        gql`
            mutation DisconnectAccount($account: String!) {
                disconnectAccount(account: $account)
            }
        `
    )

    // exported methods
    const addConnectedAccount = (account: "youtube" | "reddit" | "spotify") => {
        setConnectedAccounts({
            ...connectedAccounts,
            [account]: true,
        })

        showSearchPrompt(true)
    }

    const removeConnectedAccount = (account: "youtube" | "reddit" | "spotify") => {
        setConnectedAccounts({
            ...connectedAccounts,
            [account]: false,
        })
    }

    const youtubeConnect = useYouTubeConnect(() => addConnectedAccount("youtube"))
    const redditConnect = useRedditConnect(() => addConnectedAccount("reddit"))
    const spotifyConnect = useSpotifyConnect(() => addConnectedAccount("spotify"))

    return {
        loading,
        showingSearchPrompt,
        profile,
        youtube: {
            connect: youtubeConnect,
            disconnect: async () => {
                await disconnectAccount({ variables: { account: "youtube" } })
                removeConnectedAccount("youtube")
            },
            isConnected: connectedAccounts.youtube,
        },
        reddit: {
            connect: redditConnect,
            disconnect: async () => {
                await disconnectAccount({ variables: { account: "reddit" } })
                removeConnectedAccount("reddit")
            },
            isConnected: connectedAccounts.reddit,
        },
        spotify: {
            connect: spotifyConnect,
            disconnect: async () => {
                await disconnectAccount({ variables: { account: "spotify" } })
                removeConnectedAccount("spotify")
            },
            isConnected: connectedAccounts.spotify,
        },
    }
}

export function Profile() {
    const {
        youtube,
        spotify,
        reddit,
        profile,
        loading,
        showingSearchPrompt,
    } = useConnectAccountAndProfile()

    return (
        <div className="profile-page">
            <StackHeader title="Profile settings" />

            <section className="profile">
                <img alt="me" src={profile?.picture} />

                <div className="profile-details">
                    <p>{profile?.firstName}</p>
                    <span>
                        {profile?.location.city ? `${profile.location.city},` : ""}{" "}
                        {profile?.location.state}
                    </span>
                </div>
            </section>

            {!loading && (
                <section className="linked-accounts">
                    <p>Linked accounts</p>

                    {showingSearchPrompt && (
                        <div className="after-connect">
                            <p>You connected a new account</p>
                            <Link to="/app/find-friend">Click here to search for friends</Link>
                        </div>
                    )}

                    {/* youtube */}
                    <article
                        onClick={
                            !youtube.isConnected
                                ? () => {
                                      youtube.connect()
                                      trackEvent("Connect youtube account", {
                                          category: "Connect",
                                          label: "profile",
                                      })
                                  }
                                : undefined
                        }
                        className="account youtube"
                    >
                        <img
                            alt=""
                            src={
                                youtube.isConnected
                                    ? require("assets/images/tick.png")
                                    : require("assets/images/plus.png")
                            }
                        />

                        <div className="account-details">
                            <p className="account-type">
                                {youtube.isConnected ? "YouTube connected" : "Connect Youtube"}
                            </p>
                            {!youtube.isConnected && <p>We only scan your subscriptions</p>}
                        </div>

                        {youtube.isConnected && (
                            <FiX
                                onClick={() => {
                                    youtube.disconnect()
                                    trackEvent("Disconnect youtube account", {
                                        category: "Disconnect",
                                        label: "profile",
                                    })
                                }}
                                className="icon"
                            />
                        )}
                    </article>

                    {/* spotify */}
                    <article
                        onClick={
                            !spotify.isConnected
                                ? () => {
                                      spotify.connect()
                                      trackEvent("Connect spotify account", {
                                          category: "Connect",
                                          label: "profile",
                                      })
                                  }
                                : undefined
                        }
                        className="account spotify"
                    >
                        <img
                            alt=""
                            src={
                                spotify.isConnected
                                    ? require("assets/images/tick.png")
                                    : require("assets/images/plus.png")
                            }
                        />

                        <div className="account-details">
                            <p className="account-type">
                                {spotify.isConnected ? "Spotify connected" : "Connect Spotify"}
                            </p>
                            {!spotify.isConnected && <p>We only scan your genre and top artists</p>}
                        </div>

                        {spotify.isConnected && (
                            <FiX
                                onClick={() => {
                                    spotify.disconnect()
                                    trackEvent("Disconnect spotify account", {
                                        category: "Disconnect",
                                        label: "profile",
                                    })
                                }}
                                className="icon"
                            />
                        )}
                    </article>

                    {/* reddit */}
                    <article
                        onClick={
                            !reddit.isConnected
                                ? () => {
                                      reddit.connect()
                                      trackEvent("Connect reddit account", {
                                          category: "Connect",
                                          label: "profile",
                                      })
                                  }
                                : undefined
                        }
                        className="account reddit"
                    >
                        <img
                            alt=""
                            src={
                                reddit.isConnected
                                    ? require("assets/images/tick.png")
                                    : require("assets/images/plus.png")
                            }
                        />

                        <div className="account-details">
                            <p className="account-type">
                                {reddit.isConnected ? "Reddit connected" : "Connect Reddit"}
                            </p>
                            {!reddit.isConnected && <p>We only scan your subreddits</p>}
                        </div>

                        {reddit.isConnected && (
                            <FiX
                                onClick={() => {
                                    reddit.disconnect()
                                    trackEvent("Disconnect reddit account", {
                                        category: "Disconnect",
                                        label: "profile",
                                    })
                                }}
                                className="icon"
                            />
                        )}
                    </article>
                </section>
            )}
        </div>
    )
}
