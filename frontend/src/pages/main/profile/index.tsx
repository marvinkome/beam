import React, { useState, useEffect, useRef } from "react"
import { ConnectAccount } from "components/connect-account"
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

export function Profile() {
    const { loading, data } = useFetchData()
    const [showingSearchPrompt, showSearchPrompt] = useState(false)
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

                    {showingSearchPrompt && (
                        <div className="after-connect">
                            <p>You connected a new account</p>
                            <Link to="/app/find-friend">Click here to search for friends</Link>
                        </div>
                    )}

                    {/* youtube */}
                    <ConnectAccount onConnect={() => showSearchPrompt(true)} hasDisconnect />
                </section>
            )}
        </div>
    )
}
