import { IContext, pubsub } from '@gql/index'
import { IUser } from '@models/users'
import Message from '@models/messages'
import Conversation from '@models/conversations'

type sendMessageData = {
    to: string
    message: string
}
export const resolvers = {
    sendMessage: async (_: any, data: sendMessageData, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) return false

        // check if user is a friend
        const { friends } = await user.populate('friends').execPopulate()
        const friend = (friends as any).find((friend: any) => friend.id === data.to) as IUser

        if (!friend) {
            return {
                code: 400,
                success: false,
                message: 'Friend not found',
            }
        }

        // find or create a conversation
        let conversation = await Conversation.findOne({
            users: {
                $all: [user.id, friend.id],
            },
        })

        if (!conversation) {
            conversation = new Conversation()
            conversation.users = [user.id, friend.id]

            await conversation.save()
        }

        // create message
        const message = new Message()
        message.message = data.message
        message.from = user.id
        message.to = conversation.id

        await message.save()

        // publish change with pubsub
        await pubsub.publish('SENT_MESSAGE', {
            messageSent: message,
            friendId: friend.id,
        })

        // send push notification

        return {
            code: 200,
            success: true,
            sentMessage: message,
        }
    },
}
