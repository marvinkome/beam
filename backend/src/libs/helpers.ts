import { IUser } from '@models/users'
import { generate } from 'shortid'
import Invitation from '@models/invitations'

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
