import { IUser } from '@models/users'
import Conversation from '@models/conversations'
import Message from '@models/messages'
import Group from '@models/groups'
import { IContext } from '..'

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

            const connectedData = user.connectedAccounts
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
                    image: interest.image,
                    group: group,
                })
            }

            return interestWithGroupId
        },

        lastMessage: async (user: IUser, _: any, ctx: IContext) => {
            const conversation = await Conversation.findOne({
                users: {
                    $all: [user.id, ctx.currentUser?.id],
                },
            })

            return Message.findOne({ to: conversation?.id }).sort('-timestamp')
        },
    },

    Profile: {
        firstName: (profile: { name: string; picture: string }) => {
            return profile.name.split(' ')[0]
        },
    },
}
