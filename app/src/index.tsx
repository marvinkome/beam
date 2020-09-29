import "react-native-gesture-handler"
import React from "react"
import Toast from "react-native-toast-message"
import { ThemeProvider } from "react-native-elements"
import { NavigationContainer } from "@react-navigation/native"
import { RootNavigation } from "screens"
import { theme } from "styles/theme"
import { navigationRef } from "libs/navigator"

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <NavigationContainer ref={navigationRef}>
                <RootNavigation />

                <Toast ref={(ref: any) => Toast.setRef(ref)} />
            </NavigationContainer>
        </ThemeProvider>
    )
}
