declare module "react-native-toast-message" {
    export default Toast
    class Toast extends Component<any, any, any> {
        static _ref: any
        static setRef(ref?: {}): void
        static getRef(): any
        static clearRef(): void
        static show(options?: {}): void
        static hide(): void
        constructor(props: any)
        _setState(reducer: any): Promise<any>
        _animateMovement(gesture: any): void
        _animateRelease(gesture: any): void
        startTimer(): void
        animate({ toValue }: { toValue: any }): Promise<any>
        show(options?: {}): Promise<void>
        hide(): Promise<void>
        onLayout(e: any): void
        panResponder: import("react-native").PanResponderInstance
        animateShow(): Promise<any>
        animateHide(): Promise<any>
        timer: number
        clearTimer(): void
        renderContent({ config }: { config: any }): any
        getBaseStyle(position?: string): any[]
    }
    import { Component } from "react"
}
