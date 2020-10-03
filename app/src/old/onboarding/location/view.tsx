import React from "react"
import Toast from "react-native-toast-message"
import { getGeolocation } from "libs/helpers"
import { ScrollView, StyleSheet, View } from "react-native"
import { Text, Button } from "react-native-elements"

type IProps = {
    saveLocation: (location: { lat: number; long: number }) => void
}
export function LocationView(props: IProps) {
    const setLocation = async () => {
        try {
            const loc = await getGeolocation()
            await props.saveLocation(loc)
        } catch (e) {
            if (e.code === 1) {
                Toast.show({
                    type: "error",
                    text1: "We need your location to find people nearby",
                    position: "bottom",
                })
            }
            // TODO:: Sentry capture error
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.pageHeader}>
                <Text h1>Add your location</Text>
                <Text style={styles.headerText}>
                    We need your location to find others your nearby
                </Text>
            </View>

            <Button title="ADD LOCATION" onPress={setLocation} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 52,
        flex: 1,
        justifyContent: "space-between",
    },
    pageHeader: {
        flex: 1,
    },
    headerText: {
        marginTop: 15,
    },
})
