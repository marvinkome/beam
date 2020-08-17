import React from "react"
import ReactModal from "react-modal"
import "./style.scss"

ReactModal.setAppElement("#root")

type IProps = {
    isOpen: boolean
    toggleModal: () => void
    id: string
    header?: JSX.Element
    children: JSX.Element[] | JSX.Element
}

export function Modal(props: IProps) {
    return (
        <ReactModal
            isOpen={props.isOpen}
            onRequestClose={props.toggleModal}
            id={props.id}
            overlayClassName="modal-overlay"
            className="modal-container"
        >
            {props.children}
        </ReactModal>
    )
}

export { default as AddFriend } from "./addFriend"
export { default as ShareBeam } from "./shareBeam"
