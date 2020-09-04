export type LoaderType = "top" | "transparent" | "fullscreen"
export type LoadingDataType = { id: string; isLoading: boolean; type: LoaderType; message?: string }

class Loader {
    loadingIds: string[] = []
    listeners: Map<
        string,
        Array<(isLoading: boolean, type: LoaderType, message?: string) => void>
    > = new Map()

    on = (
        event: string,
        callback: (isLoading: boolean, type: LoaderType, message?: string) => void
    ) => {
        if (typeof callback === "function") {
            this.listeners.has(event) || this.listeners.set(event, [])

            this.listeners.get(event)?.push(callback)

            return this
        }
    }

    off = (
        event: string,
        callback: (isLoading: boolean, type: LoaderType, message?: string) => void
    ) => {
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

    startLoading = (type: LoaderType, message?: string) => {
        let id = Date.now() + "-" + Math.random() * 9999

        this.loadingIds.push(id)

        this.emit("loading", this.isLoading(), type, message)

        return () => this.stopLoading(id)
    }

    stopLoading = (id: any) => {
        let idx = this.loadingIds.findIndex((n) => n === id)

        this.loadingIds.splice(idx, 1)

        this.emit("loading", this.isLoading())
    }
}

export const loader = new Loader()
export const startLoader = (type?: LoaderType, message?: string) =>
    loader.startLoading(type || "top", message)
