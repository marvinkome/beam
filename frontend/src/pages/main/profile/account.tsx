import React from "react"
import { trackEvent } from "lib/analytics"
import { FiX } from "react-icons/fi"
import { useConnectAccount, useDisconnectAccount } from "hooks"

type IProps = {
    account: "youtube" | "spotify" | "reddit"
    description: string
    isConnected: boolean
    onAction: (account: "youtube" | "spotify" | "reddit", isConnected: boolean) => void
}

export function ProfileAccount(props: IProps) {
    const connect = useConnectAccount(props.account, (completed: boolean) => {
        if (completed) {
            props.onAction(props.account, true)
            trackEvent(`connect ${props.account} account`, {
                category: "Connect",
                label: "profile",
            })
        }
    })

    const onConnect = () => {
        if (props.isConnected) return undefined
        connect()
    }

    const disconnect = useDisconnectAccount(props.account)
    const onDisconnect = async () => {
        await disconnect()

        props.onAction(props.account, false)
        trackEvent(`disconnected ${props.account} account`, {
            category: "Disconnect",
            label: "profile",
        })
    }

    return (
        <article onClick={onConnect} className={`account ${props.account}`}>
            <img
                alt=""
                src={
                    props.isConnected
                        ? require("assets/images/tick.png")
                        : require("assets/images/plus.png")
                }
            />

            <div className="account-details">
                <p className="account-type">
                    {props.isConnected ? `${props.account} connected` : `Connect ${props.account}`}
                </p>
                {!props.isConnected && <p>{props.description}</p>}
            </div>

            {props.isConnected && <FiX onClick={onDisconnect} className="icon" />}
        </article>
    )
}
