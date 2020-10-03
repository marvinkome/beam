import { TextProps } from "react-native-elements"
import { StyleProp } from "react-native"

type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> }

declare module "react-native-elements" {
    export interface Colors {
        white: string
        black: string
        background: string
        border: string
        text: string
        altText: string
        danger: string
    }
}
