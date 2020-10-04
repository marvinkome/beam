import { DarkTheme } from "@react-navigation/native"
import { Theme, colors } from "react-native-elements"
import fonts from "./fonts"

const appColors = {
    primary: "#9175DB",
    secondary: "#B3A4DB",
    background: "#32294D",

    white: "#39324D", // this is used as black in react native elements internals
    black: "#E8EAED", // this is used as white in react native elements internals

    grey0: "#686080",
    grey1: "rgba(62, 63, 64, 0.5)",
    grey2: "#E8EAED",
    grey3: "#32294D",

    purple0: "#32294D",
    purple1: "#4A3C70",
    purple2: "#534480",
    purple3: "#614F94",
    purple4: "#9175DB",
    purple5: "#B3A4DB",

    green: "#48D38A",
}

export const theme: Theme = {
    colors: {
        ...colors,
        ...appColors,
    },

    // component styles
    Text: {
        style: {
            fontSize: 16,
            ...fonts.regular,
        },

        h1Style: {
            fontSize: 35,
            ...fonts.semiBold,
        },

        h2Style: {
            fontSize: 24,
            ...fonts.semiBold,
        },

        h3Style: {
            fontSize: 20,
            ...fonts.semiBold,
        },

        h4Style: {
            fontSize: 18,
            ...fonts.semiBold,
        },
    },

    Button: {
        containerStyle: {
            marginBottom: 10,
        },

        buttonStyle: {
            borderRadius: 50,
            padding: 15,
        },

        titleStyle: {
            fontSize: 16,
            fontFamily: "SourceSansPro-SemiBold",
            letterSpacing: 1,
        },
    },

    Input: {
        containerStyle: {
            paddingVertical: 0,
            paddingHorizontal: 0,
        },
        inputContainerStyle: {
            borderRadius: 10,
            borderWidth: 1,
            paddingHorizontal: 15,
            borderColor: "#5B6176",
        },
        inputStyle: {
            fontSize: 18,
            fontFamily: "SourceSansPro-Regular",
        },
    },
}

export const reactNavigationTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: appColors.background,
        primary: appColors.primary,
        text: appColors.black,
    },
}
