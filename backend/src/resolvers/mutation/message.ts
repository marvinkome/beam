import Message from '@models/messages'
import Conversation from '@models/conversations'
import Group from '@models/groups'
import { IContext, pubsub } from 'src/graphql'
import { IUser } from '@models/users'
import { sendNotification } from '@libs/helpers'

type sendMessageData = {
    to: string
    message: string
}
export const resolvers = {
    sendMessage: async (_: any, data: sendMessageData, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) {
            return {
                code: 400,
                success: false,
                message: 'user not found',
            }
        }

        // check if user is a friend
        const { friends } = await user.populate('friends').execPopulate()
        const friend = (friends as any).find((friend: any) => friend.id === data.to) as IUser

        if (!friend) {
            return {
                code: 400,
                success: false,
                message: 'Friend not found',
            }
        }

        // find or create a conversation
        let conversation = await Conversation.findOne({
            'users.user': {
                $all: [user.id, friend.id],
            },
        })

        if (!conversation) {
            conversation = new Conversation()
            conversation.users = [{ user: user.id }, { user: friend.id }]

            await conversation.save()
        }

        // create message
        const message = new Message()
        message.message = data.message
        message.from = user.id
        message.to = conversation.id

        await message.save()

        // publish change with pubsub
        await pubsub.publish('SENT_MESSAGE', {
            messageSent: message,
            friendId: friend.id,
        })

        // send push notification
        await sendNotification({
            type: 'user',
            userToken: friend.notificationToken || '',
            title: user.profile.name?.split(' ')[0],
            body: message.message,
            image: user.profile.picture,
            linkPath: `/app/chat/${user.id}`,
        })

        return {
            code: 200,
            success: true,
            sentMessage: message,
        }
    },

    sendMessageToGroup: async (_: any, data: sendMessageData, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) {
            return {
                code: 400,
                success: false,
                message: 'user not found',
            }
        }

        const group = await Group.findOne({ _id: data.to })
        if (!group) {
            return {
                code: 400,
                success: false,
                message: 'Group not found',
            }
        }

        // check if user is in group
        if (!group.users.find((gUser) => gUser.user == user.id)) {
            return {
                code: 400,
                success: false,
                message: "Can't send message to this group",
            }
        }

        // create message
        const message = new Message()
        message.message = data.message
        message.from = user.id
        message.to = group.id

        await message.save()

        // publish change with pubsub
        await pubsub.publish('SENT_MESSAGE', {
            messageSent: message,
            groupId: group.id,
        })

        // send push notification
        await sendNotification({
            type: 'group',
            groupId: group.id,
            title: group.name,
            body: message.message,
            image: group.image,
            linkPath: `/app/group/${group.id}`,
        })

        return {
            code: 200,
            success: true,
            sentMessage: message,
        }
    },
}
