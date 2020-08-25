import { IGroup } from '@models/groups'
import Message from '@models/messages'
import { IContext } from '..'

export const groupResolvers = {
    Group: {
        users: async (group: IGroup) => {
            const groupWithPopulate = await group.populate('users.user').execPopulate()
            return groupWithPopulate.users
        },

        isMember: async (group: IGroup, _: any, ctx: IContext) => {
            // check if current user is a member
            const user = ctx.currentUser
            if (!user) return false

            return !!group.users.find((gUser) => gUser.user == user.id)
        },

        lastMessage: async (group: IGroup) => {
            return Message.findOne({ to: group?.id }).sort('-timestamp')
        },

        messages: async (group: IGroup, data: any) => {
            return Message.find({ to: group.id })
                .sort({ timestamp: -1 })
                .limit(data.first || 10)
                .skip(data.after || 0)
        },
    },
}
