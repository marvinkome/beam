import React, { useState, useEffect, useCallback } from "react"
import classnames from "classnames"
import { loader, LoadingDataType, LoaderType } from "./loader"
import "./style.scss"

const EVENT_LOADING = "loading"
const MOUNTED: Array<string | null> = []

export function LoaderContainer() {
    const [loaderData, setLoaders] = useState<
        Array<{
            isLoading: boolean
            type?: LoaderType
            message?: string
        }>
    >([])

    const [id, setId] = useState<string | null>(null)

    const setLoadingState = useCallback(
        (loader?: LoadingDataType) => {
            if (MOUNTED.indexOf(id) > -1) {
                setLoaders(
                    loaderData.concat({
                        isLoading: !!loader,
                        type: loader?.type,
                        message: loader?.message,
                    })
                )
            }
        },
        [id, loaderData]
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
            {loaderData.map((data, id) => {
                if (data.type === "top") {
                    return <TopLoader key={id} loading={data.isLoading} />
                }

                if (data.type === "fullscreen") {
                    return (
                        <FullScreenLoader
                            key={id}
                            message={data.message}
                            loading={data.isLoading}
                        />
                    )
                }

                return null
            })}
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
