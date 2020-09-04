import React, { useState, useEffect, useCallback } from "react"
import classnames from "classnames"
import { loader } from "./loader"
import "./style.scss"

const EVENT_LOADING = "loading"
const MOUNTED: Array<string | null> = []

export function LoaderContainer() {
    const [loaderData, setLoaderData] = useState({
        loading: false,
        type: "",
        message: "",
    })

    const [id, setId] = useState<string | null>(null)

    const setLoadingState = useCallback(
        (loading, type, message) => {
            if (MOUNTED.indexOf(id) < 0) return

            setLoaderData({
                loading,
                type,
                message,
            })
        },
        [id]
    )

    useEffect(() => {
        MOUNTED.push(id)
        setId(Math.random().toString(36).substr(-7))

        loader.off(EVENT_LOADING, setLoadingState)
        loader.on(EVENT_LOADING, setLoadingState)

        return () => {
            const index = MOUNTED.indexOf(id)
            ;-1 < index && MOUNTED.splice(index, 1)

            loader.off(EVENT_LOADING, setLoadingState)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            {loaderData.type === "top" && <TopLoader loading={loaderData.loading} />}
            {loaderData.type === "fullscreen" && (
                <FullScreenLoader message={loaderData.message} loading={loaderData.loading} />
            )}
        </div>
    )
}

function TopLoader({ loading }: { loading: boolean }) {
    return (
        <div className={classnames(["top-loader", { loading }])}>
            <div className="layer layer_1" />
            <div className="layer layer_2" />
        </div>
    )
}

function FullScreenLoader(props: { loading: boolean; message?: string }) {
    return (
        <div className={classnames(["fullscreen-loader", { loading: props.loading }])}>
            <div className="loader" />
            <p>{props.message}</p>
        </div>
    )
}
