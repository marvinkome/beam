import Geocoder from 'node-geocoder'
import User, { AccountType } from '@models/users'
import Invitation from '@models/invitations'
import Group from '@models/groups'
import { authenticated } from '@libs/auth'
import { IContext } from 'src/graphql'
import { generateInviteId, getUsersSharedInterests, sendNotification } from '@libs/helpers'
import { sendInviteEmail, sendAcceptInviteEmail } from '@libs/emails'
import { messaging } from 'firebase-admin'

type ConnectAccountInputType =
    | {
          account: AccountType.YOUTUBE
          subs: Array<{ name: string; id: string }>
      }
    | {
          account: AccountType.SPOTIFY
          artists: Array<{ name: string; id: string }>
          genres: string[]
      }
    | {
          account: AccountType.REDDIT
          subreddits: Array<{ name: string; id: string }>
      }

export const resolvers = {
    /* === CONNECT ACCOUNTS ==== */
    connectAccount: authenticated(async (_: any, data: any, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) return false

        const { input } = data as { input: ConnectAccountInputType }
        switch (input.account) {
            case AccountType.YOUTUBE: {
                await user.updateOne({
                    $addToSet: {
                        connectedAccounts: input.subs.map((sub) => ({
                            ...sub,
                            platform: 'youtube',
                        })),
                    },
                })

                return true
            }
            case AccountType.SPOTIFY: {
                await user.updateOne({
                    $addToSet: {
                        connectedAccounts: input.artists.map((artist) => ({
                            ...artist,
                            type: 'artist',
                            platform: 'spotify',
                        })),
                    },
                })

                await user.updateOne({
                    $addToSet: {
                        connectedAccounts: input.genres.map((genre) => ({
                            name: genre,
                            type: 'genre',
                            platform: 'spotify',
                        })),
                    },
                })

                return true
            }
            case AccountType.REDDIT: {
                await user.updateOne({
                    $addToSet: {
                        connectedAccounts: input.subreddits.map((subreddit) => ({
                            ...subreddit,
                            platform: 'reddit',
                        })),
                    },
                })

                return true
            }
            default:
                return false
        }
    }),

    disconnectAccount: authenticated(async (_: any, data: any, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) return false

        const { account } = data as { account: AccountType }
        switch (account) {
            case AccountType.YOUTUBE: {
                await user.updateOne(
                    {
                        $pull: {
                            connectedAccounts: { platform: 'youtube' },
                        },
                    },
                    { multi: true }
                )

                return true
            }
            case AccountType.SPOTIFY: {
                await user.updateOne(
                    {
                        $pull: {
                            connectedAccounts: { platform: 'spotify' },
                        },
                    },
                    { multi: true }
                )

                return true
            }
            case AccountType.REDDIT: {
                await user.updateOne(
                    {
                        $pull: {
                            connectedAccounts: { platform: 'reddit' },
                        },
                    },
                    { multi: true }
                )
                return true
            }
            default:
                return false
        }
    }),

    /* ==== PROFILE ==== */
    setLocation: authenticated(async (_: any, { location }: any, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) return null

        const geocoder = Geocoder({ provider: 'openstreetmap' })
        const res = await geocoder.reverse({ lat: location.lat, lon: location.long })
        const { country, city, state } = res[0]

        user.profile.location = {
            long: location.long,
            lat: location.lat,
            state: state || '',
            city: city || '',
            country: country || '',
        }

        return user.save()
    }),

    setNotificationToken: authenticated(async (_: any, { token }: any, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) return null

        // set token
        user.notificationToken = token
        await user.save()

        // subscribe to group push notifications
        const userGroups = await Group.find({
            'users.user': { $eq: user.id },
        })

        for (const group of userGroups) {
            await messaging().subscribeToTopic(token, group.id)
        }

        return true
    }),

    /* ==== INVITE FRIEND ==== */
    createInviteLink: authenticated(async (_: any, __: any, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) return false

        const { item } = await generateInviteId(user)
        const url = `${process.env.CLIENT_URL}/invite/${encodeURIComponent(item.inviteId)}`

        return url
    }),

    addFriend: authenticated(async (_: any, data: any, ctx: IContext) => {
        const { inviteToken } = data as { inviteToken: string }
        try {
            const user = ctx.currentUser
            if (!user) throw new Error('User not found')

            if (!inviteToken) {
                throw new Error('Invite token not found')
            }

            const invitation = await Invitation.findOne({ inviteId: inviteToken })
            if (!invitation) {
                throw Error('Invitation expired')
            }

            const friend = await User.findOne({
                _id: invitation.user,
            })
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
            return {
                code: 200,
                success: true,
                message: 'Friend added',
            }
        } catch (e) {
            console.log(e)

            return {
                code: 400,
                success: false,
                message: e.message,
            }
        }
    }),

    /* ==== ADD FRIEND ==== */
    addFriendById: authenticated(async (_: any, data: any, ctx: IContext) => {
        const { friendId } = data as { friendId: string }
        try {
            const user = ctx.currentUser
            if (!user) throw new Error('User not found')

            const friend = await User.findOne({ _id: friendId })

            if (!friend) throw new Error('Friend not found')
            if (friend.id === user.id) throw new Error('Friend not found')

            await friend.updateOne({
                $addToSet: { friends: user.id },
            })

            await user.updateOne({
                $addToSet: { friends: friend.id },
            })

            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }),

    /* ==== FRIEND REQUESTS ==== */
    sendFriendRequest: authenticated(async (_: any, data: any, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) return false

        const { matchId } = data as { matchId: string }

        // get friend
        const match = await User.findOne({ _id: matchId })

        if (!match) return false

        await match.updateOne({
            $addToSet: {
                requests: {
                    from: user.id,
                },
            },
        })

        // send email and push notification
        const numberOfInterests = await getUsersSharedInterests(user, match)

        if (match.notificationToken) {
            await sendNotification({
                type: 'user',
                userToken: match.notificationToken || '',
                title: `You’ve got a chat invite from ${user.profile.name?.split(' ')[0]}`,
                body: `You both share ${numberOfInterests.length || 0} interests`,
                linkPath: '/app/invites',
            })
        }

        sendInviteEmail({
            to: match.email,
            data: {
                matchName: user.profile.name?.split(' ')[0],
                interestsCount: numberOfInterests.length || 0,
            },
        })

        return true
    }),

    respondToFriendRequest: authenticated(async (_: any, data: any, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) return false

        const { matchId, accepted } = data as { matchId: string; accepted: boolean }

        // get user sending request
        const requestingUser = await User.findOne({ _id: matchId })
        if (!requestingUser) return false
        if (requestingUser.id === user.id) return false

        if (accepted) {
            await requestingUser.updateOne({
                $addToSet: { friends: user.id },
            })

            await user.updateOne({
                $pull: {
                    requests: {
                        from: requestingUser.id,
                    },
                },
                $addToSet: { friends: requestingUser.id },
            })

            // send notification
            if (requestingUser.notificationToken) {
                await sendNotification({
                    type: 'user',
                    userToken: requestingUser.notificationToken,
                    title: `${user.profile.name?.split(' ')[0]} accepted your invite`,
                    body: 'Say hello',
                    linkPath: `/app/chat/${user.id}`,
                })
            }

            sendAcceptInviteEmail({
                to: requestingUser.email,
                data: {
                    friendName: user.profile.name?.split(' ')[0],
                    friendId: user.id,
                },
            })
        } else {
            await user.updateOne({
                $pull: {
                    requests: {
                        from: requestingUser.id,
                    },
                },
                $addToSet: { declinedRequests: requestingUser.id },
            })
        }

        return true
    }),
}
