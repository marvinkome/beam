import React, { useState } from "react"
import { StatusColors, StatusFonts } from "libs/constants"
import { TextStatusScreen } from "./TextStatus"

export function TextStatus() {
    const colorKeys = Object.keys(StatusColors)

    // @ts-ignore
    const defaultColor = StatusColors[colorKeys[(colorKeys.length * Math.random()) << 0]]

    const [status, setStatus] = useState({
        text: "",
        bgColor: defaultColor,
        font: StatusFonts.font1,
    })

    const onChange = (key: keyof typeof status, value: string) => {
        setStatus({ ...status, [key]: value })
    }

    return (
        <TextStatusScreen
            text={status.text}
            bgColor={status.bgColor}
            font={status.font}
            onChange={onChange}
        />
    )
}
