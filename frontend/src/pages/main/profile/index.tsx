import React, { useState, useEffect, useRef } from "react"
import { ProfileAccount } from "./account"
import { Link } from "react-router-dom"
import { StackHeader } from "components/header"
import { useQuery, gql } from "@apollo/client"
import { startLoader } from "components"
import "./style.scss"

function useFetchData() {
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

    const stopLoader = useRef<any>()
    useEffect(() => {
        if (loading && !data) {
            stopLoader.current = startLoader("fullscreen", "Loading profile data...")
        } else {
            stopLoader.current && stopLoader.current()
        }
    }, [data, loading])

    return {
        data,
        loading,
    }
}

function useConnectedAccounts(data: any) {
    const [showingSearchPrompt, showSearchPrompt] = useState(false)
    const [connectedAccounts, setConnectedAccounts] = useState({
        youtube: false,
        spotify: false,
        reddit: false,
    })

    useEffect(() => {
        if (data?.me?.connectedAccounts) {
            setConnectedAccounts(data.me.connectedAccounts)
        }
    }, [data])

    return {
        connectedAccounts,
        showingSearchPrompt,

        setConnectedAccount: (account: "youtube" | "reddit" | "spotify", isConnected: boolean) => {
            setConnectedAccounts({
                ...connectedAccounts,
                [account]: isConnected,
            })

            if (isConnected) {
                showSearchPrompt(true)
            }
        },
    }
}

export function Profile() {
    const { loading, data } = useFetchData()
    const connectedAccountsData = useConnectedAccounts(data)
    const profile = data?.me.profile

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

                    {connectedAccountsData.showingSearchPrompt && (
                        <div className="after-connect">
                            <p>You connected a new account</p>
                            <Link to="/app/find-friend">Click here to search for friends</Link>
                        </div>
                    )}

                    {/* youtube */}
                    <ProfileAccount
                        account="youtube"
                        description="We only scan your subscriptions"
                        isConnected={connectedAccountsData.connectedAccounts["youtube"]}
                        onAction={connectedAccountsData.setConnectedAccount}
                    />

                    {/* spotify */}
                    <ProfileAccount
                        account="spotify"
                        description="We only scan your genre and top artists"
                        isConnected={connectedAccountsData.connectedAccounts["spotify"]}
                        onAction={connectedAccountsData.setConnectedAccount}
                    />

                    {/* reddit */}
                    <ProfileAccount
                        account="reddit"
                        description="We only scan your subreddits"
                        isConnected={connectedAccountsData.connectedAccounts["reddit"]}
                        onAction={connectedAccountsData.setConnectedAccount}
                    />
                </section>
            )}
        </div>
    )
}
