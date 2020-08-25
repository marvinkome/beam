import { IContext } from '@gql/index'
import Group, { Roles } from '@models/groups'

export const resolvers = {
    createGroup: async (_: any, { interestId }: any, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) {
            return {
                success: false,
                message: 'User not found',
            }
        }

        // get user location
        const userState = user.profile.location?.state
        if (!userState) {
            return {
                success: false,
                message: 'You need to give location access to create a group',
            }
        }

        // get interest
        const interest = user.connectedAccounts?.find((data) => data.id === interestId)
        if (!interest) {
            return {
                success: false,
                message: "Can't create group",
            }
        }

        // create group
        const group = new Group()

        // set data
        group.name = `${interest.name} - ${userState}`
        group.image = interest.image
        group.interest = interest.name
        group.location = userState
        group.users = [
            {
                user: user.id,
                role: Roles.admin,
            },
        ]

        await group.save()

        return {
            success: true,
            message: 'Group created',
            group,
        }
    },

    joinGroup: async (_: any, { groupId }: any, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) {
            return {
                success: false,
                message: 'User not found',
            }
        }

        // get group
        const group = await Group.findOne({
            _id: groupId,
            'users.user': { $ne: user.id },
        })

        if (!group) {
            return {
                success: false,
                message: 'Group not found',
            }
        }

        await group.updateOne({
            $addToSet: {
                users: {
                    user: user.id,
                    role: Roles.user,
                },
            },
        })

        return {
            success: true,
            message: 'Joined group',
            group,
        }
    },
}
