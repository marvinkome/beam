import React, { useState } from "react"
import Toast from "react-native-toast-message"
import _ImagePicker from "react-native-image-crop-picker"
import { View, StyleSheet, ImageSourcePropType } from "react-native"
import { Image, Button } from "react-native-elements"
import { theme } from "styles/theme"

type IProps = {
    image: ImageSourcePropType
    onSelect: (image: string) => void
}
export function ImagePicker(props: IProps) {
    const onPress = async () => {
        try {
            const image = await _ImagePicker.openPicker({
                width: 400,
                height: 400,
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
                    color: theme.colors?.grey1,
                }}
                title="Change"
                onPress={onPress}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    profileImageContainer: {
        borderWidth: 3,
        borderColor: theme.colors?.primary,
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },

    changeProfileButton: {
        width: 120,
        marginVertical: 15,
        paddingVertical: 3,
        borderRadius: 10,
        borderColor: theme.colors?.grey0,
        justifyContent: "space-between",
    },
    changeProfileText: {
        color: theme.colors?.grey1,
        letterSpacing: 0,
    },
})
