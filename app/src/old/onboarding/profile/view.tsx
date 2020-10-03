import React from "react"
import Toast from "react-native-toast-message"
import { ScrollView, View, StyleSheet, ImageSourcePropType, TouchableOpacity } from "react-native"
import { Text, Button, Input, Icon } from "react-native-elements"
import { DatePicker, ImagePicker } from "components"
import { theme } from "styles/theme"
import { getGeolocation } from "libs/helpers"

type IProps = {
    profile: {
        image: ImageSourcePropType
        name: string
        birthday: Date | undefined
        location: any
    }
    setProfile: (key: keyof IProps["profile"], value: any) => void
}

export function ProfileView(props: IProps) {
    const setLocation = async () => {
        try {
            const loc = await getGeolocation()
            console.log(loc)
            props.setProfile("location", loc)
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
        <ScrollView contentContainerStyle={{ paddingVertical: "15%" }} style={styles.container}>
            <View style={styles.header}>
                <Text h1>Tell us about yourself</Text>
            </View>

            <View style={styles.pageContainer}>
                {/* image */}
                <ImagePicker
                    image={props.profile.image}
                    onSelect={(path) => props.setProfile("image", { uri: path })}
                />

                {/* details */}
                <View style={styles.textInputs}>
                    {/* name */}
                    <Input
                        inputContainerStyle={styles.inputContainerStyle}
                        placeholder="First name"
                        value={props.profile.name}
                        onChangeText={(text) => props.setProfile("name", text)}
                    />

                    {/* year */}
                    <Text style={styles.datePickerLabel}>My birthday is:</Text>
                    <DatePicker
                        style={styles.inputContainerStyle}
                        value={props.profile.birthday}
                        onChange={(date) => props.setProfile("birthday", date.toISOString())}
                    />
                </View>

                {/* location */}
                <TouchableOpacity onPress={setLocation}>
                    <View style={styles.locationContainer}>
                        <Icon
                            size={50}
                            style={styles.locationIcon}
                            color={theme.colors?.primary}
                            name="location-on"
                        />

                        <View>
                            <Text h4 style={styles.locationHeader}>
                                Add your location
                            </Text>
                            <Text style={styles.locationText}>So we can find others nearby</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: theme.colors?.background,
    },

    header: {
        marginBottom: 10,
        alignItems: "center",
    },

    pageContainer: {
        paddingVertical: 32,
    },

    textInputs: {
        paddingVertical: 20,
    },

    inputContainerStyle: {
        width: 200,
    },

    datePickerLabel: {
        fontSize: 18,
        color: theme.colors?.grey1,
        fontFamily: "SourceSansPro-SemiBold",
        marginBottom: 10,
        marginLeft: 5,
    },

    locationContainer: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 10,
        borderColor: theme.colors?.primary,

        flexDirection: "row",
        alignItems: "center",

        marginTop: 15,
        paddingVertical: 20,
        paddingHorizontal: 30,
    },

    locationIcon: {
        marginRight: 20,
    },
    locationHeader: {
        color: theme.colors?.primary,
        marginBottom: 5,
    },
    locationText: {
        // fontSize: 14,
    },
})
