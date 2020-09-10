import { IContext } from '@gql/index'
import Group, { Roles } from '@models/groups'
import { IUser } from '@models/users'
import { sendJoinGroupEmail } from '@libs/emails'
import { sendNotification } from '@libs/helpers'
import { messaging } from 'firebase-admin'

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

        // check if user has reached max number of groups (15)
        const userGroups = await Group.find({ 'users.user': user.id })
        if (userGroups.length >= 15) {
            return {
                success: false,
                message: "You've reached your group limit of 15",
            }
        }

        // create group
        const group = new Group()

        // set data
        group.name = `${interest.platform === 'reddit' ? 'r/' : ''}${interest.name} - ${userState}`
        group.image = interest.image
        group.interest = interest.name
        group.location = userState
        group.users = [
            {
                user: user.id,
                role: Roles.user,
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

        const userGroups = await Group.find({ 'users.user': user.id })
        if (userGroups.length >= 15) {
            return {
                success: false,
                message: "You've reached your group limit of 15",
            }
        }

        // check if user is in group location
        if (user.profile.location?.state !== group.location) {
            return {
                success: false,
                message: 'This group is not for you location',
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

        // subscribe to group push notifications
        if (user.notificationToken) {
            await messaging().subscribeToTopic(user.notificationToken, group.id)
        }

        // send joined group email
        const groupUsersEmail = (await group.populate('users.user').execPopulate()).users
            .filter((groupUser) => (groupUser.user as IUser).id != user.id)
            .map((groupUser) => (groupUser.user as IUser).email)

        await sendNotification({
            type: 'group',
            groupId: group.id,
            title: `${user.profile.name?.split(' ')[0]} just joined ${group.name}`,
            image: group.image,
            linkPath: `/app/group/${group.id}`,
        })

        sendJoinGroupEmail({
            to: groupUsersEmail,
            data: {
                memberName: user.profile.name?.split(' ')[0],
                groupName: group.name,
                groupId: group.id,
            },
        })

        return {
            success: true,
            message: 'Joined group',
            group,
        }
    },

    leaveGroup: async (_: any, { groupId }: any, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) {
            return false
        }

        const group = await Group.findOne({
            _id: groupId,
            'users.user': user.id,
        })

        if (!group) {
            return false
        }

        // TODO:: If user is an admin, transfer admin role to someone else

        await group.updateOne({
            $pull: { users: { user: user.id } },
        })

        // subscribe to group push notifications
        if (user.notificationToken) {
            await messaging().unsubscribeFromTopic(user.notificationToken, group.id)
        }

        return true
    },
}
