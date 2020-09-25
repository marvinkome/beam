import React, { useState, useEffect, useRef } from "react"
import { useQuery, gql } from "@apollo/client"
import { startLoader } from "components"
import { Account } from "./account"
import "./style.scss"

type IProps = {
    onConnect?: () => void
    onConnectAll?: () => void
    hasDisconnect?: boolean
}

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
                }
            }
        `
    )

    const stopLoader = useRef<any>()
    useEffect(() => {
        if (loading && !data) {
            stopLoader.current = startLoader()
        } else {
            stopLoader.current && stopLoader.current()
        }
    }, [data, loading])

    return {
        data,
        loading,
    }
}

export function ConnectAccount(props: IProps) {
    const { data } = useFetchData()

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

    useEffect(() => {
        // @ts-ignore
        if (Object.keys(connectedAccounts).filter((key) => connectedAccounts[key]).length === 3) {
            props.onConnectAll && props.onConnectAll()
        }
    }, [connectedAccounts, props])

    const setConnectedAccount = (account: any, isConnected: boolean) => {
        setConnectedAccounts({
            ...connectedAccounts,
            [account]: isConnected,
        })

        props.onConnect && props.onConnect()
    }

    return (
        <div className="connect-accounts">
            <Account
                account="youtube"
                description="We'll scan your subscriptions"
                isConnected={connectedAccounts["youtube"]}
                onAction={setConnectedAccount}
                hasDisconnect={props.hasDisconnect}
            />
            <Account
                account="spotify"
                description="We'll scan your genre and top artists"
                isConnected={connectedAccounts["spotify"]}
                onAction={setConnectedAccount}
                hasDisconnect={props.hasDisconnect}
            />
            <Account
                account="reddit"
                description="We'll scan your subreddits"
                isConnected={connectedAccounts["reddit"]}
                onAction={setConnectedAccount}
                hasDisconnect={props.hasDisconnect}
            />
        </div>
    )
}
