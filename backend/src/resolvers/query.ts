import Group from '@models/groups'
import Conversation from '@models/conversations'
import { findFriends } from '@libs/match'
import { IContext } from 'src/graphql'
import { authenticated } from '@libs/auth'

type ConversationArgs = {
    with: string
    first?: number
    sort?: boolean
    after?: number
}

export const queryResolver = {
    Query: {
        me: authenticated(async function (_: any, __: any, ctx: IContext) {
            return ctx.currentUser
        }),

        friend: authenticated(async function (_: any, { id }: { id: string }, ctx: IContext) {
            const user = ctx.currentUser
            if (!user) return false

            const { friends } = await user.populate('friends').execPopulate()

            return (friends as any).find((friend: any) => friend.id === id)
        }),

        friends: authenticated(async function (_: any, __: any, ctx: IContext) {
            const user = ctx.currentUser
            if (!user) return false

            const { friends } = await user.populate('friends').execPopulate()

            return friends
        }),

        conversation: authenticated(async function (_: any, data: ConversationArgs, ctx: IContext) {
            // get conversation
            return Conversation.findOne({
                'users.user': {
                    $all: [ctx.currentUser?.id, data.with],
                },
            })
        }),

        group: authenticated(async function (_: any, { id }: { id: string }) {
            // get group
            return Group.findOne({ _id: id })
        }),

        groups: authenticated(async function (_: any, __: any, ctx: IContext) {
            const user = ctx.currentUser
            if (!user) {
                return []
            }

            return Group.find({
                'users.user': user.id,
            })
        }),

        suggestedFriends: authenticated(async function (_: any, __: any, ctx: IContext) {
            const user = ctx.currentUser
            if (!user) return []

            await new Promise((res) => setTimeout(res, 2000))
            const friends = await findFriends(user)

            return friends || []
        }),
    },
}
