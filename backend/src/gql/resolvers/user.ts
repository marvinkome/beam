import User, { IUser } from '@models/users'
import Conversation from '@models/conversations'
import Message from '@models/messages'
import Group from '@models/groups'
import { IContext } from '..'
import { getUsersSharedInterests } from '@libs/helpers'

export const userResolvers = {
    User: {
        connectedAccounts: (user: IUser) => {
            const youtube = !!user.connectedAccounts?.filter((acc) => acc.platform === 'youtube')
                .length
            const reddit = !!user.connectedAccounts?.filter((acc) => acc.platform === 'reddit')
                .length
            const spotify = !!user.connectedAccounts?.filter((acc) => acc.platform === 'spotify')
                .length

            return {
                youtube,
                reddit,
                spotify,
            }
        },

        interests: async (user: IUser) => {
            const state = user.profile.location?.state
            if (!state) return []

            const connectedData = user.connectedAccounts?.filter(
                (acc) => acc.platform !== 'spotify'
            )
            if (!connectedData) return []

            const interestWithGroupId = []

            // loop through user connected data
            for (const interest of connectedData) {
                // find group with this interest
                const group = await Group.findOne({
                    interest: interest.name,
                    location: state,
                })

                // if user is in the group then don't push
                if (group?.users.find((groupUser) => groupUser.user == user.id)) {
                    continue
                }

                interestWithGroupId.push({
                    id: interest.id,
                    name: interest.name,
                    platform: interest.platform,
                    image: interest.image,
                    group: group,
                })
            }

            return interestWithGroupId
        },

        lastMessage: async (user: IUser, _: any, ctx: IContext) => {
            const conversation = await Conversation.findOne({
                'users.user': {
                    $all: [user.id, ctx.currentUser?.id],
                },
            })

            return Message.findOne({ to: conversation?.id }).sort('-timestamp')
        },

        requestsCount: async (user: IUser) => {
            return user.requests.length
        },
    },

    Profile: {
        firstName: (profile: { name: string; picture: string }) => {
            return profile.name.split(' ')[0]
        },
    },

    Request: {
        from: ({ from }: { from: string }) => {
            return User.findOne({ _id: from })
        },

        sharedInterests: async ({ from }: { from: string }, _: any, ctx: IContext) => {
            const userA = ctx.currentUser
            const userB = await User.findOne({ _id: from })

            if (!userA || !userB) return []

            return getUsersSharedInterests(userA, userB)
        },
    },
}
