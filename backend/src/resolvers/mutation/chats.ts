import { IContext } from 'src/graphql'
import Conversation from '@models/conversations'
import Group from '@models/groups'

export const resolvers = {
    setViewConversation: async (_: any, data: any, ctx: IContext) => {
        const conversation = await Conversation.findOne({
            'users.user': {
                $all: [data.id, ctx.currentUser?.id],
            },
        })
        if (!conversation) return false

        await Conversation.updateOne(
            {
                _id: conversation._id,
                'users.user': ctx.currentUser?.id,
            },
            {
                $set: {
                    'users.$.lastViewed': data.viewing ? null : new Date(),
                },
            }
        )

        return true
    },

    setViewGroup: async (_: any, data: any, ctx: IContext) => {
        const group = await Group.findOne({ _id: data.id })
        if (!group) return false

        await Group.updateOne(
            {
                _id: group._id,
                'users.user': ctx.currentUser?.id,
            },
            {
                $set: {
                    'users.$.lastViewed': data.viewing ? null : new Date(),
                },
            }
        )

        return true
    },
}
