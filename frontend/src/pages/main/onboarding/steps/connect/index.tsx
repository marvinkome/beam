import React, { useState, useEffect } from "react"
import cls from "classnames"
import { useQuery, gql } from "@apollo/client"
import { checkForConnectedAccounts } from "lib/helpers"
import { trackPageView } from "lib/analytics"
import { Account } from "./account"
import "./style.scss"

function useConnectAccount(changeStep: any) {
    const [connectedAccounts, setConnectedAccounts] = useState({
        youtube: false,
        spotify: false,
        reddit: false,
    })

    // fetch connected accounts
    const { data } = useQuery(gql`
        {
            me {
                id
                connectedAccounts {
                    reddit
                    spotify
                    youtube
                }
            }
        }
    `)

    // add connected accounts to state
    useEffect(() => {
        if (data?.me) {
            setConnectedAccounts(data.me.connectedAccounts)
        }
    }, [data])

    // if all accounts are connected then move to next step
    useEffect(() => {
        if (
            connectedAccounts["youtube"] &&
            connectedAccounts["reddit"] &&
            connectedAccounts["spotify"]
        ) {
            changeStep()
        }
    }, [connectedAccounts, changeStep])

    // exported methods
    const addConnectedAccount = (account: "youtube" | "reddit" | "spotify") => {
        setConnectedAccounts({
            ...connectedAccounts,
            [account]: {
                isLoading: true,
                isConnected: true,
            },
        })
    }

    const hasConnectedAnAccount = checkForConnectedAccounts(connectedAccounts)

    return {
        hasConnectedAnAccount,
        onConnect: addConnectedAccount,
        accountConnected: (account: "youtube" | "reddit" | "spotify") => connectedAccounts[account],
    }
}

export function ConnectAccount(props: { changeStep: () => void }) {
    useEffect(() => trackPageView("connect-page"), [])
    const { onConnect, accountConnected, hasConnectedAnAccount } = useConnectAccount(
        props.changeStep
    )

    return (
        <main className="connect-account-page">
            <header className="page-header">
                <h1>Connect your accounts to Beam</h1>

                <p>We'll use this to match you with people who love the same things.</p>
            </header>

            <section className="page-content">
                <Account
                    account="youtube"
                    isConnected={accountConnected("youtube")}
                    onConnect={() => onConnect("youtube")}
                />

                <Account
                    account="spotify"
                    isConnected={accountConnected("spotify")}
                    onConnect={() => onConnect("spotify")}
                />

                <Account
                    account="reddit"
                    isConnected={accountConnected("reddit")}
                    onConnect={() => onConnect("reddit")}
                />
            </section>

            <button
                onClick={props.changeStep}
                className={cls("btn btn-primary", { disabled: !hasConnectedAnAccount })}
            >
                Continue
            </button>
        </main>
    )
}
