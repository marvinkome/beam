import React from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { ImagePicker } from "components"
import { Icon, Text } from "react-native-elements"
import { theme } from "styles/theme"
import { useNavigation } from "@react-navigation/native"
import fonts from "styles/fonts"

type IProps = {
    profile: {
        firstName: string
        picture: string
    }

    savingPicture: boolean
    onChangePicture: (file: string) => void
}

export function ProfileScreen(props: IProps) {
    const navigation = useNavigation()

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Icon
                    size={30}
                    name="arrow-left"
                    type="feather"
                    onPress={navigation.goBack}
                    containerStyle={{ marginRight: 20 }}
                />

                <Text style={styles.headerText}>Profile settings</Text>
            </View>

            <View style={styles.pageContainer}>
                {/* image */}
                <ImagePicker
                    loading={props.savingPicture}
                    image={{ uri: props.profile.picture }}
                    onSelect={props.onChangePicture}
                />

                {/* details */}
                <View style={styles.textInputs}>
                    {/* name */}
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.name}>{props.profile.firstName}</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.label}>
                        If you wish to delete your account send an email to team@usebeam.chat
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors?.primary,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },

    headerText: {
        fontSize: 18,
    },

    pageContainer: {
        paddingVertical: 32,
        paddingHorizontal: 25,
    },

    textInputs: {
        paddingVertical: 5,
    },

    label: {
        color: theme.colors?.grey4,
    },

    name: {
        marginTop: 10,
        ...fonts.semiBold,
    },

    footer: {
        marginTop: 16 * 6,
    },
})
