import e from 'express'
import passport from 'passport'
import Invitation from '@models/invitations'
import User, { IUser } from '@models/users'
import { IContext } from 'src/graphql'
import { generateToken } from '@libs/auth'
import { registerSetup } from 'src/libs/setup'

function googleAuth(req: e.Request, res: e.Response): Promise<{ user: IUser; info: any }> {
    return new Promise((resolve, reject) => {
        passport.authenticate('google-token', { session: false }, (err, user, info) => {
            if (err) reject(err)
            resolve({ user, info })
        })(req, res)
    })
}

async function handleLogin(data: any) {
    // user exists return user
    let user = await User.findOne({ [data.authType]: data.id })
    if (user) return user

    // check if user already registered
    user = await User.findOne({ email: data.email })
    if (user) return null

    // register user if user doesn't exist
    user = new User({
        email: data.email,
        [data.authType]: data.id,
        profile: {
            name: data.name,
            picture: data.picture,
        },
    })
    await user.save()

    // send welcome email
    await registerSetup(user)
    return user
}

export const resolver = {
    googleLogin: async (_: any, { token, inviteToken }: any, { req, res }: IContext) => {
        req.body = { ...req.body, access_token: token }

        try {
            const { user, info } = await googleAuth(req, res)

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

    login: async (_: any, { authData, inviteToken }: any) => {
        const user = await handleLogin(authData)
        if (!user) {
            return {
                success: false,
                message: 'An account already exists with this email',
            }
        }

        // handle invite
        if (inviteToken) {
            const invitation = await Invitation.findOne({ inviteId: inviteToken })
            if (!invitation) {
                return {
                    success: false,
                    message:
                        'Invitation expired. Please request a new invite link from your friend',
                }
            }

            const friend = await User.findOne({ _id: invitation.user })

            if (!friend) {
                return {
                    success: false,
                    message: 'Invalid invite link',
                }
            }

            if (friend.id === user.id) {
                return {
                    success: false,
                    message: 'Invalid invite link',
                }
            }

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
            success: true,
            message: 'Login successful',
            user,
            token: generateToken(user),
        }
    },
}
