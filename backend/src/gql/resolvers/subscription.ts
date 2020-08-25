import { pubsub } from '..'
import { withFilter } from 'apollo-server-express'

export const subscriptionResolver = {
    Subscription: {
        messageSent: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(['SENT_MESSAGE']),

                (payload, variables, ctx) => {
                    const messageNotFromCurrentUser =
                        payload.messageSent.from !== ctx.currentUser?.id

                    if (variables.friendId) {
                        const fromSpecifiedFriend = payload.messageSent.from == variables.friendId
                        return messageNotFromCurrentUser && fromSpecifiedFriend
                    }

                    if (variables.groupId) {
                        const fromSpecifiedGroup = payload.groupId == variables.groupId
                        return messageNotFromCurrentUser && fromSpecifiedGroup
                    }

                    return false
                }
            ),
        },

        lastSeen: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(['USER_CONNECTED']),

                // filter to only send time
                // if user is not current user
                // and specified friend connected
                (payload, variables, ctx) => {
                    const messageNotFromCurrentUser = payload.userId !== ctx.currentUser?.id
                    const fromSpecifiedFriend = `${payload.userId}` === variables.friendId

                    return messageNotFromCurrentUser && fromSpecifiedFriend
                }
            ),
        },
    },
}
