export function formatMessages(messages: any[]) {
    return messages.map((message) => ({
        _id: message.id,
        text: message.message,
        createdAt: new Date(parseInt(message.timestamp, 10)),
        pending: message.id < 0,
        user: {
            _id: message.from.id,
            name: message.from.profile.firstName,
        },
    }))
}

export function createClientResponse(message: string, userId: string, error?: boolean) {
    // optimistic response have negative ids between -1 and -100
    // error response have negative ids between -101 and -200 (except we have 200 error messages lol)
    const messageId = error
        ? Math.floor(Math.random() * (-101 - -200) + -200)
        : Math.floor(Math.random() * (-0 - -100) + -100)

    return {
        sendMessage: {
            code: "200",
            success: true,
            sentMessage: {
                __typename: "Message",
                id: messageId,
                message,
                timestamp: Date.now(),
                from: {
                    id: userId,
                    __typename: "User",
                    profile: {
                        // not needed as it's not shown
                        firstName: "",
                        picture: "",
                        __typename: "Profile",
                    },
                },
            },
        },
    }
}
