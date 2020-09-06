import passport from 'passport'
import e from 'express'
import { IContext } from '@gql/index'
import { generateToken } from '@libs/auth'
import User, { IUser } from '@models/users'
import Invitation from '@models/invitations'

const authenticateGoogle = (
    req: e.Request,
    res: e.Response
): Promise<{ user: IUser; info: any }> => {
    return new Promise((resolve, reject) => {
        passport.authenticate('google-token', { session: false }, (err, user, info) => {
            if (err) reject(err)
            resolve({ user, info })
        })(req, res)
    })
}

const authenticateFacebook = (
    req: e.Request,
    res: e.Response
): Promise<{ user: IUser; info: any }> => {
    return new Promise((resolve, reject) => {
        passport.authenticate('facebook-token', { session: false }, (err, user, info) => {
            if (err) reject(err)
            resolve({ user, info })
        })(req, res)
    })
}

export const resolver = {
    googleLogin: async (
        _: any,
        { token, inviteToken, youtubeData }: any,
        { req, res }: IContext
    ) => {
        req.body = { ...req.body, access_token: token }

        try {
            const { user, info } = await authenticateGoogle(req, res)

            if (info) {
                throw new Error(info)
            }

            if (inviteToken) {
                const invitation = await Invitation.findOne({ inviteId: inviteToken })
                if (!invitation) {
                    throw Error('Invitation expired')
                }

                const friend = await User.findOne({ _id: invitation.user })
                if (!friend) throw new Error('Friend not found')
                if (friend.id === user.id) throw new Error('Friend not found')

                await User.updateOne(
                    { _id: friend },
                    {
                        $addToSet: { friends: user.id },
                    }
                )

                await user.updateOne({
                    $addToSet: { friends: friend },
                })

                // delete invite token
                await invitation.remove()
            }

            if (youtubeData) {
                user.connectedAccounts = user.connectedAccounts?.concat(
                    youtubeData.map((sub: any) => ({
                        ...sub,
                        platform: 'youtube',
                    }))
                )

                await user.save()
            }

            return {
                code: 200,
                success: true,
                message: 'Login successfull',
                user,
                token: generateToken(user),
            }
        } catch (err) {
            console.log(err)
            return {
                code: 400,
                success: false,
                message: err.message,
            }
        }
    },

    facebookLogin: async (_: any, { token, inviteToken }: any, { req, res }: IContext) => {
        req.body = { ...req.body, access_token: token }

        try {
            const { user, info } = await authenticateFacebook(req, res)
            if (info) {
                throw new Error(info)
            }

            if (inviteToken) {
                const invitation = await Invitation.findOne({ inviteId: inviteToken })
                if (!invitation) {
                    throw Error('Invitation expired')
                }

                const friend = await User.findOne({ _id: invitation.user })
                if (!friend) throw new Error('Friend not found')
                if (friend.id === user.id) throw new Error('Friend not found')

                await User.updateOne(
                    { _id: friend },
                    {
                        $addToSet: { friends: user.id },
                    }
                )

                await user.updateOne({
                    $addToSet: { friends: friend },
                })

                // delete invite token
                await invitation.remove()
            }

            return {
                code: 200,
                success: true,
                token: generateToken(user),
            }
        } catch (err) {
            console.log(err)
            return {
                code: 400,
                success: false,
                message: 'Something went wrong',
            }
        }
    },
}
