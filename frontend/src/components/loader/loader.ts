import debounce from "lodash.debounce"

export type LoaderType = "top" | "transparent" | "fullscreen"
export type LoadingDataType = { id: string; isLoading: boolean; type: LoaderType; message?: string }

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

    // normal emit for when stopping events, because we want to
    // call stop when needed
    emit = (event: string, loader?: LoadingDataType) => {
        if (!this.listeners.has(event)) {
            return false
        }

        if (loader?.isLoading) {
            // start loading
            this.loadingData.push(loader!)
        } else {
            // stop loading
            let idx = this.loadingData.findIndex((n) => n.id === loader?.id)
            this.loadingData.splice(idx, 1)
        }

        this.listeners.get(event)?.forEach((callback) => {
            setTimeout(() => callback.call(null, loader), 0)
        })

        return true
    }

    debouncedEmit = debounce(this.emit, 250, { leading: true, trailing: false })

    startLoading = (loader: { type: LoaderType; message?: string }) => {
        let id = Date.now() + "-" + Math.random() * 9999

        const loaderData = {
            id,
            isLoading: true,
            type: loader.type,
            message: loader.message,
        }

        this.debouncedEmit("loading", loaderData)
        return () => this.stopLoading(id)
    }

    stopLoading = (id: string) => {
        let idx = this.loadingData.findIndex((n) => n.id === id)
        if (idx < 0) {
            return
        }

        const newLoader = {
            ...this.loadingData[idx],
            isLoading: false,
        }

        this.emit("loading", newLoader)
    }
}

export const loader = new Loader()
export const startLoader = (
    loaderType: { type: LoaderType; message?: string } = { type: "top" }
) => {
    return loader.startLoading(loaderType!)
}
