import React from "react"
import cls from "classnames"
import { formatDate } from "lib/helpers"

type ChatBubbleProps = {
    message: {
        id: string
        messageId?: string
        message: string
        senderName?: string
        senderImage?: string
        timestamp: number
        sending?: boolean
    }
    bubbleStyles?: any
}

export function ChatBubble(props: ChatBubbleProps) {
    return (
        <div className={cls("chat-bubble", { mine: props.message.id === "0" })}>
            {/* img */}
            <img alt={props.message.senderName} src={props.message.senderImage} />

            {/* bubble */}
            <div className="bubble-card">
                <div className="bubble-header">
                    <p>{props.message.senderName}</p>
                    <p>{formatDate(props.message.timestamp)}</p>
                </div>

                <p>{props.message.message}</p>

                <div className="bubble-footer">
                    <p>{formatDate(props.message.timestamp)}</p>
                    {props.message.sending && <p className="sending">sending...</p>}
                </div>
            </div>
        </div>
    )
}
