import { DarkTheme } from "@react-navigation/native"
import { Theme, colors } from "react-native-elements"

const appColors = {
    primary: "#9175DB",
    background: "#32294D",
    white: "#E8EAED",
    black: "#39324D",
    grey1: "rgba(50, 41, 77, 0.5)",
    grey0: "#32294D",
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
            fontWeight: "400",
            fontFamily: "SourceSansPro-Regular",
        },

        h1Style: {
            fontSize: 35,
            fontWeight: "400",
            fontFamily: "SourceSansPro-SemiBold",
        },

        h2Style: {
            fontSize: 24,
            fontWeight: "400",
            fontFamily: "SourceSansPro-SemiBold",
        },

        h3Style: {
            fontSize: 20,
            fontWeight: "400",
            fontFamily: "SourceSansPro-SemiBold",
        },

        h4Style: {
            fontSize: 18,
            fontWeight: "400",
            fontFamily: "SourceSansPro-SemiBold",
        },
    },

    Button: {
        buttonStyle: {
            borderRadius: 50,
            padding: 15,
            marginBottom: 10,
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
        text: appColors.white,
    },
}
