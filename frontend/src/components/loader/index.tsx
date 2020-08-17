import React from "react"
import classnames from "classnames"
import findIndex from "lodash.findindex"

import "./style.scss"

const EVENT_LOADING = "loading"
const MOUNTED: Array<string | null> = []

class Loader {
    loadingIds: string[] = []
    listeners: Map<string, Array<(...args: any[]) => void>> = new Map()

    on = (event: string, callback: (...args: any[]) => void) => {
        if (typeof callback === "function") {
            this.listeners.has(event) || this.listeners.set(event, [])

            this.listeners.get(event)?.push(callback)

            return this
        }
    }

    off = (event: any, callback: (...args: any[]) => void) => {
        if (!this.listeners.has(event)) return

        let cbs = this.listeners.get(event)

        if (cbs) {
            let idx = cbs.indexOf(callback)
            ;-1 < idx && cbs.splice(idx, 1)

            return this
        }
    }

    emit = (event: string, ...args: any[]) => {
        if (!this.listeners.has(event)) {
            return false
        }

        this.listeners
            .get(event)
            ?.forEach((callback: any) => setTimeout(() => callback.call(null, ...args), 0))

        return true
    }

    isLoading = () => this.loadingIds.length > 0

    startLoading = () => {
        let id = Date.now() + "-" + Math.random() * 9999

        this.loadingIds.push(id)

        this.emit(EVENT_LOADING, this.isLoading())

        return () => this.stopLoading(id)
    }

    stopLoading = (id: any) => {
        let idx = findIndex(this.loadingIds, function (n) {
            return n === id
        })

        this.loadingIds.splice(idx, 1)

        this.emit(EVENT_LOADING, this.isLoading())
    }
}

let loader = new Loader()

export const startLoader = () => loader.startLoading()

export const stopLoader = (id: any) => loader.stopLoading(id)

export default class XhrLoader extends React.Component {
    state = {
        loading: false,
        id: null,
    }

    componentDidMount() {
        this.setState(
            {
                id: Math.random().toString(36).substr(-7),
            },
            () => {
                MOUNTED.push(this.state.id)
            }
        )

        loader.off(EVENT_LOADING, this.setLoadingState)
        loader.on(EVENT_LOADING, this.setLoadingState)
    }

    componentWillUnmount() {
        const { id } = this.state
        const index = MOUNTED.indexOf(id)
        ;-1 < index && MOUNTED.splice(index, 1)

        loader.off(EVENT_LOADING, this.setLoadingState)
    }

    setLoadingState = (isLoading: boolean) => {
        if (MOUNTED.indexOf(this.state.id) > -1) {
            this.setState({
                loading: isLoading,
            })
        }
    }

    render() {
        const { loading } = this.state

        return (
            <div className={classnames(["xhr-loader", { loading: loading }])}>
                <div className="layer layer_1" />
                <div className="layer layer_2" />
            </div>
        )
    }
}
