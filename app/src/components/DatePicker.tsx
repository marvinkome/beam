import React, { useState } from "react"
import dayjs from "dayjs"
import DateTimePicker from "@react-native-community/datetimepicker"
import { View, Text, StyleSheet, Platform } from "react-native"
import { theme } from "styles/theme"

type IProps = {
    style?: any
    value: Date | undefined
    onChange: (date: Date) => void
}
export function DatePicker(props: IProps) {
    const [showingPicker, showPicker] = useState(false)

    const onChange = (_: any, selectedDate: Date | undefined) => {
        showPicker(Platform.OS === "ios")
        if (selectedDate) {
            props.onChange(selectedDate)
        }
    }

    const textStyle: any[] = [styles.datePickerInputText]
    if (!props.value) textStyle.push(styles.placeholderText)

    return (
        <>
            <View style={[styles.datePickerContainer, props.style]}>
                <Text onPress={() => showPicker(true)} style={textStyle}>
                    {props.value ? dayjs(props.value).format("DD/MM/YYYY") : "DD/MM/YYYY"}
                </Text>
            </View>

            {showingPicker && (
                <DateTimePicker
                    display="spinner"
                    value={props.value || new Date()}
                    onChange={onChange}
                    onTouchCancel={() => showPicker(Platform.OS === "ios")}
                    maximumDate={dayjs().subtract(18, "year").toDate()}
                />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    datePickerContainer: {
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderColor: "#5B6176",
    },
    datePickerInputText: {
        fontSize: 16,
        letterSpacing: 1.15,
        color: theme.colors?.grey0,
    },
    placeholderText: {
        color: theme.colors?.grey1,
    },
})
