import { IUser } from '@models/users'
import { generate } from 'shortid'
import Invitation from '@models/invitations'
import { messaging } from 'firebase-admin'

export async function generateInviteId(user: IUser) {
    const inviteId = generate()

    const invite = new Invitation({
        user,
        inviteId,
    })

    await invite.save()
    return { item: invite }
}

export async function getUsersSharedInterests(userA: IUser, userB: IUser) {
    const userAInterests = userA.connectedAccounts
    const userBInterests = userB.connectedAccounts

    if (!userAInterests || !userAInterests.length || !userBInterests || !userBInterests.length) {
        return []
    }

    // scan through connected data
    const sharedInterests = userAInterests.reduce((sharedInterests: any[], current) => {
        const similar = userBInterests.find(
            (acc) => acc.name.toLowerCase() === current.name.toLowerCase()
        )

        if (similar) {
            sharedInterests.push(similar)
        }

        return sharedInterests
    }, [])

    const uniqueInterests = [...new Set(sharedInterests.map((i) => i.name))].map((name) =>
        sharedInterests.find((i) => i.name === name)
    )

    return uniqueInterests
}

type BaseNotification = {
    title?: string
    body?: string
    image?: string
    linkPath?: string
}
type GroupNotif = BaseNotification & {
    type: 'group'
    groupId: string
}
type UserNotif = BaseNotification & {
    type: 'user'
    userToken: string
}
export async function sendNotification(notification: GroupNotif | UserNotif) {
    const notificationObject: any = {
        webpush: {
            notification: {
                title: notification.title,
                body: notification.body,
                icon: notification.image,
                badge: `${process.env.CLIENT_URL}/notif-logo.png`,
            },
        },
    }

    if (notification.linkPath && notificationObject.webpush) {
        notificationObject.webpush.fcmOptions = {
            link: `${process.env.CLIENT_URL}${notification.linkPath}`,
        }
    }

    if (notification.type === 'group') {
        notificationObject.topic = notification.groupId
    } else {
        notificationObject.token = notification.userToken
    }

    return messaging().send(notificationObject)
}
