import { IMessage } from '@models/messages'
import { IContext } from '..'
import { IConversation } from '@models/conversations'

export const messageResolvers = {
    Message: {
        from: async (message: IMessage) => {
            const { from } = await message.populate('from').execPopulate()
            return from
        },

        to: async (message: IMessage, _: any, ctx: IContext) => {
            const { to: conversation } = (await message.populate('to').execPopulate()) as {
                to: IConversation
            }

            const {
                users: [to],
            } = await conversation
                .populate({
                    path: 'users',
                    match: { _id: { $ne: ctx.currentUser?.id } },
                })
                .execPopulate()

            return to
        },
    },
}
