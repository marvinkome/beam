export function formatMessages(messages: any[]) {
    return messages.map((message) => ({
        _id: message.id,
        text: message.message,
        createdAt: new Date(parseInt(message.timestamp, 10)),
        pending: message.id === null,
        user: {
            _id: message.from.id,
            name: message.from.profile.firstName,
        },
    }))
}
