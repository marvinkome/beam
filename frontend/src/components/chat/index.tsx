import React from "react"
import cls from "classnames"
import TextareaAutosize from "react-autosize-textarea"
import { useDropdown } from "hooks"
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi"
import { useHistory } from "react-router-dom"
import { MdSend } from "react-icons/md"
import { ChatFeed } from "react-chat-ui"
import { ChatBubble } from "./bubble"

import "./style.scss"

type IProps = {
    isPreviewing: boolean
    description: string
    profile: {
        name: string
        image: any
    }
    defaultMessage: string
    messages: Array<{
        id: string
        messageId?: string
        message: string
        senderName?: string
        senderImage?: string
        timestamp: number
        sending?: boolean
    }>

    actions?: Array<{
        title: string
        action: () => void
    }>

    sendMessage: (e: React.FormEvent) => void
    joinGroup?: () => void
}

export function ChatUi(props: IProps) {
    const history = useHistory()
    const { toggleDropdown, dropdownOpen } = useDropdown()

    return (
        <div className="chat-ui">
            <header>
                <FiArrowLeft
                    onClick={() =>
                        props.isPreviewing ? history.goBack() : history.push("/app/chats")
                    }
                    className="icon"
                />

                <img alt={props.profile.name} src={props.profile.image} />

                <div className="user-details">
                    <p>{props.profile.name}</p>
                    <span>{props.description}</span>
                </div>

                {props.actions?.length && (
                    <div className="actions">
                        <FiMoreVertical onClick={toggleDropdown} className="icon" />

                        <div className={cls("dropdown-container", { isOpen: dropdownOpen })}>
                            <div className="dropdown">
                                {props.actions.map((option, id) => (
                                    <span key={id} onClick={option.action}>
                                        {option.title}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <section className="chat-section">
                <div className="chat-container">
                    {!props.messages.length && !props.isPreviewing && (
                        <div className="default-message">
                            <p>{props.defaultMessage}</p>
                        </div>
                    )}

                    <ChatFeed chatBubble={ChatBubble} messages={props.messages} />
                </div>
            </section>

            <footer>
                {props.isPreviewing ? (
                    <button className="btn btn-primary" onClick={props.joinGroup}>
                        Join this group
                    </button>
                ) : (
                    <form onSubmit={props.sendMessage} className="form-section">
                        <TextareaAutosize id="message" placeholder="Type a message" maxRows={5} />

                        <button type="submit" className="send">
                            <MdSend className="icon" />
                        </button>
                    </form>
                )}
            </footer>
        </div>
    )
}
