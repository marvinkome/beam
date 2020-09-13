import { IMessage } from '@models/messages'
import { IContext } from 'src/graphql'
import Conversation, { IConversation } from '@models/conversations'
import Group, { IGroup } from '@models/groups'

export const messageResolvers = {
    Message: {
        from: async (message: IMessage) => {
            const { from } = await message.populate('from').execPopulate()
            return from
        },

        to: async (message: IMessage, _: any, ctx: IContext) => {
            const { toConversation, toGroup } = await message
                .populate('toGroup')
                .populate('toConversation')
                .execPopulate()

            if (toGroup) {
                return toGroup
            }

            const newConvo = await (toConversation as IConversation)
                .populate({
                    path: 'users.user',
                    match: { _id: { $ne: ctx.currentUser?.id } },
                })
                .execPopulate()

            return newConvo.users.find((user) => !!user.user)?.user
        },
    },

    MessageTo: {
        __resolveType: async (to: any) => {
            console.log(to)
            if (to.name) {
                return 'Group'
            }

            if (to.email) {
                return 'User'
            }

            return null
        },
    },
}
