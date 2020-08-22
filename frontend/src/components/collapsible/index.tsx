import React, { useState } from "react"
import cls from "classnames"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

type Props = {
    defaultValue: boolean
    children: any
    className: string
    header: any
}
export function Collapsible(props: Props) {
    const [isOpen, setOpen] = useState(props.defaultValue)
    const toggle = () => setOpen(!isOpen)

    return (
        <div className={cls(props.className, { collapsed: !isOpen })}>
            <header onClick={toggle}>
                {props.header}

                {isOpen ? <FaChevronUp className="icon" /> : <FaChevronDown className="icon" />}
            </header>

            {isOpen && props.children}
        </div>
    )
}
