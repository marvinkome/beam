import React from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import { Text, Image } from "react-native-elements"
import { theme } from "styles/theme"
import fonts from "styles/fonts"

const { width, height } = Dimensions.get("window")
const text = `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore delectus at
animi nam. Deserunt ad ex deleniti ratione tenetur itaque error sequi vero, qui
voluptate modi possimus omnis incidunt ab. Lorem ipsum dolor sit amet
consectetur adipisicing elit. Optio eos nihil neque, ex amet vel quas esse quis,
ipsum reiciendis quibusdam. Obcaecati itaque excepturi fuga incidunt rem officia
quos autem?Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore
delectus at animi nam. Deserunt ad ex deleniti ratione tenetur itaque error
sequi vero, qui voluptate modi possimus omnis incidunt ab. Lorem ipsum dolor sit
amet consectetur adipisicing elit. Optio eos nihil neque, ex amet vel quas ess`

console.log(text.length)
export function StatusItem() {
    return (
        <View style={styles.container}>
            {/* status slider */}
            <View style={styles.slider} />

            {/* name */}
            <View style={styles.profileContainer}>
                <Image source={require("assets/images/me.jpeg")} style={styles.profileImage} />

                <View>
                    <Text style={{ ...fonts.bold, marginBottom: 5 }}>Robert</Text>
                    <Text style={{ fontSize: 14 }}>Today at 8:00 am</Text>
                </View>
            </View>

            {/* main status */}
            <View style={styles.mainContainer}>
                <Text adjustsFontSizeToFit style={styles.mainText}>
                    {text}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width,
        height: height - 100,
    },

    slider: {
        position: "absolute",
        top: 0,
        zIndex: 1,
        width: "100%",
        height: 3,
        backgroundColor: theme.colors?.grey1,
    },

    profileContainer: {
        position: "absolute",
        top: 0,
        zIndex: 1,
        flexDirection: "row",
        paddingVertical: 20,
        paddingHorizontal: 15,
    },

    profileImage: {
        borderWidth: 3,
        borderColor: theme.colors?.purple3,
        borderRadius: 10,
        width: 55,
        height: 55,
        marginRight: 15,
    },

    mainContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    mainText: {
        fontSize: 20,
        textAlign: "center",
        paddingHorizontal: 25,
        color: theme.colors?.black,
    },
})
