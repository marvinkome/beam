import { Theme } from "react-native-elements"

export const theme: Theme = {
    colors: {
        primary: "#9175DB",
        grey0: "#32294D",
        grey1: "rgba(50, 41, 77, 0.5)",
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
        },

        titleStyle: {
            fontSize: 16,
            fontFamily: "SourceSansPro-SemiBold",
        },
    },
}