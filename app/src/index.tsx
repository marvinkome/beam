import "react-native-gesture-handler"
import React from "react"
import { ThemeProvider } from "react-native-elements"
import { NavigationContainer } from "@react-navigation/native"
import { RootNavigation } from "screens"
import { theme } from "styles/theme"

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <NavigationContainer>
                <RootNavigation />
            </NavigationContainer>
        </ThemeProvider>
    )
}
