import React from "react"
import { BottomTabBarProps, BottomTabBarOptions } from "@react-navigation/bottom-tabs"
import { StyleSheet, View } from "react-native"
import { Text } from "react-native-elements"
import { theme } from "styles/theme"
import { TouchableOpacity } from "react-native-gesture-handler"

const tabIcons = {}

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps<BottomTabBarOptions>) {
    const focusedOptions = descriptors[state.routes[state.index].key].options
    if (focusedOptions.tabBarVisible === false) return null

    return (
        <View style={styles.container}>
            {state.routes.map((route, idx) => {
                const { options } = descriptors[route.key]
                const isFocused = state.index === idx

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    })

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name)
                    }
                }

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    })
                }

                return (
                    <TouchableOpacity
                        key={idx}
                        style={styles.tabContainer}
                        onPress={onPress}
                        onLongPress={onLongPress}
                    >
                        <Text>Status</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors?.background,
        flexDirection: "row",
        paddingVertical: 10,
    },

    tabContainer: {
        // flex: 1,
    },
})
