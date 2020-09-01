import findIndex from "lodash.findindex"

export type LoaderType = "top" | "transparent" | "fullscreen"
export type LoadingDataType = { id: string; type: LoaderType; message?: string }

class Loader {
    loadingData: LoadingDataType[] = []
    listeners: Map<string, Array<(loader?: LoadingDataType) => void>> = new Map()

    on = (event: string, callback: (loader?: LoadingDataType) => void) => {
        if (typeof callback === "function") {
            this.listeners.has(event) || this.listeners.set(event, [])

            this.listeners.get(event)?.push(callback)

            return this
        }
    }

    off = (event: string, callback: (loader?: LoadingDataType) => void) => {
        if (!this.listeners.has(event)) return

        let cbs = this.listeners.get(event)

        if (cbs) {
            let idx = cbs.indexOf(callback)
            ;-1 < idx && cbs.splice(idx, 1)

            return this
        }
    }

    emit = (event: string, loader?: LoadingDataType) => {
        if (!this.listeners.has(event)) {
            return false
        }

        this.listeners.get(event)?.forEach((callback) => {
            setTimeout(() => callback.call(null, loader), 0)
        })

        return true
    }

    isLoading = (id?: string) => this.loadingData.find((l) => l.id === id)!

    startLoading = (loader: { type: LoaderType; message?: string }) => {
        let id = Date.now() + "-" + Math.random() * 9999

        this.loadingData.push({
            id,
            type: loader.type,
            message: loader.message,
        })

        this.emit("loading", this.isLoading(id))

        return () => this.stopLoading(id)
    }

    stopLoading = (id: string) => {
        let idx = findIndex(this.loadingData, function (n) {
            return n.id === id
        })

        this.loadingData.splice(idx, 1)

        this.emit("loading", undefined)
    }
}

export const loader = new Loader()
export const startLoader = (
    loaderType: { type: LoaderType; message?: string } = { type: "top" }
) => {
    return loader.startLoading(loaderType!)
}
