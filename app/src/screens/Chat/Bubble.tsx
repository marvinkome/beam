import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { Icon } from "react-native-elements"
import { Bubble, Time, TimeProps, BubbleProps, IMessage } from "react-native-gifted-chat"
import fonts from "styles/fonts"
import { theme } from "styles/theme"

function renderTicks({ currentMessage, user, ...props }: BubbleProps<IMessage>) {
    if (currentMessage && user && currentMessage.user && currentMessage.user._id !== user._id) {
        return null
    }

    if (
        currentMessage &&
        (currentMessage.sent || currentMessage.received || currentMessage.pending)
    ) {
        return (
            <View style={styles.tickView}>
                {!!currentMessage.sent && <Text style={[styles.tick, props.tickStyle]}>✓</Text>}
                {!!currentMessage.received && <Text style={[styles.tick, props.tickStyle]}>✓</Text>}
                {!!currentMessage.pending && (
                    <Icon
                        name="clock"
                        type="feather"
                        size={12}
                        containerStyle={{ marginLeft: -5 }}
                    />
                )}
            </View>
        )
    }
}

export function ChatBubble(props: BubbleProps<IMessage>) {
    return (
        <Bubble
            {...props}
            wrapperStyle={{ left: styles.wrapperLeft, right: styles.wrapperRight }}
            textStyle={{ left: styles.text, right: styles.text }}
            renderTime={(props: TimeProps<IMessage>) => (
                <Time
                    {...props}
                    timeTextStyle={{ left: styles.timeText, right: styles.timeText }}
                />
            )}
            renderTicks={() => renderTicks(props)}
        />
    )
}

const styles = StyleSheet.create({
    wrapperLeft: {
        backgroundColor: theme.colors?.purple4 + "40",
        borderRadius: 10,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapperRight: {
        backgroundColor: theme.colors?.purple4,
        borderRadius: 10,
        marginRight: 10,
        marginBottom: 7,
    },

    text: {
        color: theme.colors?.black,
        ...fonts.regular,
    },
    timeText: {
        fontSize: 10,
        color: theme.colors?.black + "bf",
    },
    tick: {
        fontSize: 10,
        color: theme.colors?.black + "bf",
    },
    tickView: {
        flexDirection: "row",
        marginTop: 1,
        marginRight: 10,
    },
})
