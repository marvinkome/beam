import React, { useState } from "react"
import Toast from "react-native-toast-message"
import _ImagePicker from "react-native-image-crop-picker"
import { View, StyleSheet, ImageSourcePropType } from "react-native"
import { Image, Button } from "react-native-elements"
import { theme } from "styles/theme"
import fonts from "styles/fonts"

type IProps = {
    image: ImageSourcePropType
    loading: boolean
    onSelect: (image: string) => void
}
export function ImagePicker(props: IProps) {
    const onPress = async () => {
        try {
            const image = await _ImagePicker.openPicker({
                width: 400,
                height: 400,
                crop: true,
            })

            props.onSelect(image.path)
        } catch (e) {
            Toast.show({ type: "error", text1: "Please select an image", position: "bottom" })
        }
    }

    return (
        <View>
            <Image
                containerStyle={styles.profileImageContainer}
                style={styles.profileImage}
                source={props.image}
            />
            <Button
                type="outline"
                iconRight
                buttonStyle={styles.changeProfileButton}
                titleStyle={styles.changeProfileText}
                icon={{
                    name: "camera",
                    type: "feather",
                    size: 18,
                    color: theme.colors?.black,
                }}
                title="Change"
                loading={props.loading}
                onPress={onPress}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    profileImageContainer: {
        borderWidth: 3,
        borderColor: theme.colors?.primary,
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },

    changeProfileButton: {
        width: 96,
        marginVertical: 15,
        paddingVertical: 2,
        borderRadius: 10,
        borderColor: theme.colors?.black,
        borderWidth: 2,
        justifyContent: "space-evenly",
    },
    changeProfileText: {
        color: theme.colors?.black,
        letterSpacing: 0,
        fontSize: 14,
        marginRight: 7,
        ...fonts.regular,
    },
})
