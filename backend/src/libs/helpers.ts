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
