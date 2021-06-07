import React from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { Text } from "react-native-elements"
import { StatusItem } from "./StatusItem"

const data = [
    {
        id: "id1",
        statusType: "TEXT",
        text:
            "I need to start sleeping earlier. \n\n  But I'm having problems staying away from social media. \n\n I hope Beam helps.",
        timestamp: "",
        user: {
            name: "Robert",
            image: require("assets/images/me.jpeg"),
        },
        meta: {
            font: "font1",
            bgColor: "color1",
        },
    },
]

export function StatusScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={() => <StatusItem />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
