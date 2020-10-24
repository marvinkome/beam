import React from "react"
import { StyleSheet } from "react-native"
import { InputToolbar, InputToolbarProps } from "react-native-gifted-chat"
import { Input, Icon } from "react-native-elements"
import { theme } from "styles/theme"

export function ChatInput(props: InputToolbarProps) {
    return (
        <InputToolbar
            {...props}
            containerStyle={styles.container}
            primaryStyle={styles.primaryContainer}
            renderComposer={(props) => (
                <Input
                    renderErrorMessage={false}
                    containerStyle={{ width: "80%" }}
                    inputContainerStyle={styles.inputContainer}
                    placeholder={props.placeholder}
                    placeholderTextColor={theme.colors?.grey1}
                    value={props.text}
                    disabled={props.disableComposer}
                    onChangeText={props.onTextChanged}
                    keyboardAppearance={props.keyboardAppearance}
                />
            )}
            renderSend={(props) => (
                <Icon
                    size={23}
                    name="send"
                    type="ionicon"
                    color={theme.colors?.purple4 + "80"}
                    reverseColor={theme.colors?.grey0}
                    iconStyle={{ marginLeft: 4 }}
                    onPress={() => props.onSend && props.onSend({ text: props.text?.trim() }, true)}
                    reverse
                    raised
                />
            )}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: theme.colors?.background,
        borderTopColor: theme.colors?.grey3,
    },
    primaryContainer: {
        alignItems: "center",
        justifyContent: "space-between",
    },

    inputContainer: {
        borderWidth: 0,
        borderRadius: 50,
        paddingHorizontal: 15,
        backgroundColor: theme.colors?.grey2,
    },
})
