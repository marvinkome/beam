import { IContext } from '@gql/index'
import { authenticated } from '@libs/auth'
import Message from '@models/messages'
import Conversation from '@models/conversations'
import { findFriends } from '@libs/match'
import Group from '@models/groups'

type ConversationArgs = {
    with: string
    first?: number
    sort?: boolean
    after?: number
}

export const queryResolver = {
    Query: {
        me: authenticated(async function (_: any, __: any, context: IContext) {
            return context.currentUser
        }),

        friend: authenticated(async function (_: any, { id }: { id: string }, context: IContext) {
            const user = context.currentUser
            if (!user) return false

            const { friends } = await user.populate('friends').execPopulate()

            return (friends as any).find((friend: any) => friend.id === id)
        }),

        friends: authenticated(async function (_: any, __: any, context: IContext) {
            const user = context.currentUser
            if (!user) return false

            const { friends } = await user.populate('friends').execPopulate()

            return friends
        }),

        conversation: authenticated(async function (_: any, data: ConversationArgs, ctx: IContext) {
            // get conversation
            const conversation = await Conversation.findOne({
                users: {
                    $all: [ctx.currentUser?.id, data.with],
                },
            })

            return Message.find({ to: conversation?.id })
                .sort({ timestamp: data.sort ? -1 : 1 })
                .limit(data.first || 10)
                .skip(data.after || 0)
        }),

        group: authenticated(async function (_: any, { id }: { id: string }) {
            // get group
            return Group.findOne({ _id: id })
        }),

        suggestedFriend: authenticated(async function (_: any, __: any, ctx: IContext) {
            const user = ctx.currentUser
            if (!user) return []

            await new Promise((res) => setTimeout(res, 5000))
            return findFriends(user)
        }),
    },
}
