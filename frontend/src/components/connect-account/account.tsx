import React, { useState } from "react"
import cls from "classnames"
import { FiX } from "react-icons/fi"
import { useConnectAccount, useDisconnectAccount } from "hooks"
import { trackEvent } from "lib/analytics"

type IProps = {
    account: "youtube" | "spotify" | "reddit"
    description: string
    isConnected: boolean

    onAction: (account: "youtube" | "spotify" | "reddit", isConnected: boolean) => void
    hasDisconnect?: boolean
}
export function Account(props: IProps) {
    const [loading, setLoadingState] = useState(false)

    // Actions
    const connect = useConnectAccount(props.account, (completed: boolean) => {
        if (completed) {
            props.onAction(props.account, true)
            setLoadingState(false)
            trackEvent(`connect ${props.account} account`, {
                category: "ConnectAccount",
                label: "onboarding",
            })
        }
    })
    const connectAccount = async () => {
        setLoadingState(true)
        connect()
    }

    const disconnect = useDisconnectAccount(props.account)
    const disconnectAccount = async () => {
        setLoadingState(true)

        await disconnect()

        props.onAction(props.account, false)
        trackEvent(`disconnected ${props.account} account`, {
            category: "Disconnect",
            label: "profile",
        })

        setLoadingState(false)
    }

    // image
    let accountImage = <img alt="" src={require(`assets/images/${props.account}.png`)} />
    if (loading) {
        accountImage = <div className="loader" />
    } else if (props.isConnected) {
        accountImage = <img alt="" src={require("assets/images/tick.png")} />
    }

    // description
    let description = props.description
    if (props.isConnected) {
        description = `${props.description.replace(/We'll scan your /, "")} scanned`
    }

    const className = cls("account", props.account, { connected: props.isConnected })
    return (
        <div onClick={!props.isConnected ? connectAccount : undefined} className={className}>
            {accountImage}

            <div className="account-details">
                <p className="account-type">
                    {props.isConnected ? `${props.account} connected` : `Connect ${props.account}`}
                </p>

                <p>{description}</p>
            </div>

            {props.hasDisconnect && props.isConnected && (
                <FiX onClick={disconnectAccount} className="icon" />
            )}
        </div>
    )
}
