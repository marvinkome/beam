import Message from '@models/messages'
import { IGroup } from '@models/groups'
import { IContext } from 'src/graphql'

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
            return Message.findOne({ toGroup: group?.id }).sort('-timestamp')
        },

        unreadCount: async (group: IGroup, _: any, ctx: IContext) => {
            const user = ctx.currentUser
            if (!user) return false

            const groupUser = group.users.find((gUser) => gUser.user == user.id)
            if (!groupUser) return 0

            if (!groupUser.lastViewed) return 0

            return Message.find({ toGroup: group.id })
                .where('timestamp')
                .gt(groupUser.lastViewed)
                .sort({ timestamp: -1 })
                .countDocuments()
        },

        messages: async (group: IGroup, data: any) => {
            return Message.find({ toGroup: group.id })
                .sort({ timestamp: -1 })
                .limit(data.first || 10)
                .skip(data.after || 0)
        },

        numberOfUsers: async (group: IGroup) => {
            return group.users.length
        },
    },
}
