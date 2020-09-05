import React, { useState, useEffect } from "react"
import { Modal, ShareBox } from "components"
import { trackModalView } from "lib/analytics"
import "./style.scss"

type IProps = {
    trigger: (toggleFn: () => void) => JSX.Element
    modalLocation: string
}
export default function ShareBeam(props: IProps) {
    const [modalOpen, setModalState] = useState(false)
    const toggleModal = () => setModalState(!modalOpen)

    useEffect(() => {
        if (modalOpen) {
            trackModalView(`share-beam-${props.modalLocation}`)
        }
    }, [modalOpen, props.modalLocation])

    return (
        <>
            {props.trigger(toggleModal)}

            <Modal isOpen={modalOpen} toggleModal={toggleModal} id="share-beam-modal">
                <div className="modal-header">
                    <p>Thanks for helping spread the word about Beam</p>
                </div>

                <div className="modal-content">
                    <ShareBox>Click on any of these to tell people</ShareBox>
                </div>
            </Modal>
        </>
    )
}
