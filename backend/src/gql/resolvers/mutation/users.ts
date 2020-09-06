import Geocoder from 'node-geocoder'
import { authenticated } from '@libs/auth'
import { IContext } from '@gql/index'
import User from '@models/users'
import { generateInviteId, getUsersSharedInterests } from '@libs/helpers'
import Invitation from '@models/invitations'
import { sendInviteEmail, sendAcceptInviteEmail } from '@libs/emails'

// TYPES
enum ConnectedAccountType {
    SPOTIFY = 'spotify',
    REDDIT = 'reddit',
    YOUTUBE = 'youtube',
}
type ConnectAccountInputType =
    | {
          account: ConnectedAccountType.YOUTUBE
          subs: Array<{ name: string; id: string }>
      }
    | {
          account: ConnectedAccountType.SPOTIFY
          artists: Array<{ name: string; id: string }>
          genres: string[]
      }
    | {
          account: ConnectedAccountType.REDDIT
          subreddits: Array<{ name: string; id: string }>
      }

export const resolvers = {
    connectAccount: authenticated(
        async (_: any, { input }: { input: ConnectAccountInputType }, context: IContext) => {
            const user = context.currentUser
            if (!user) return false

            switch (input.account) {
                case ConnectedAccountType.YOUTUBE: {
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
                case ConnectedAccountType.SPOTIFY: {
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
                case ConnectedAccountType.REDDIT: {
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
        }
    ),

    disconnectAccount: authenticated(
        async (_: any, { account }: { account: ConnectedAccountType }, ctx: IContext) => {
            const user = ctx.currentUser
            if (!user) return false

            switch (account) {
                case ConnectedAccountType.YOUTUBE: {
                    await user.updateOne({
                        $set: {
                            'connectedAccounts.youtube.subscriptions': [],
                        },
                    })

                    return true
                }
                case ConnectedAccountType.SPOTIFY: {
                    await user.updateOne({
                        $set: {
                            'connectedAccounts.spotify.artists': [],
                            'connectedAccounts.spotify.genres': [],
                        },
                    })

                    return true
                }
                case ConnectedAccountType.REDDIT: {
                    await user.updateOne({
                        $set: {
                            'connectedAccounts.reddit.subreddits': [],
                        },
                    })
                    return true
                }
                default:
                    return false
            }
        }
    ),

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

    createInviteLink: authenticated(async (_: any, __: any, ctx: IContext) => {
        const user = ctx.currentUser
        if (!user) return false

        const { item } = await generateInviteId(user)
        const url = `${process.env.CLIENT_URL}/invite/${encodeURIComponent(item.inviteId)}`

        return url
    }),

    addFriend: authenticated(
        async (_: any, { inviteToken }: { inviteToken: string }, context: IContext) => {
            try {
                const user = context.currentUser
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
        }
    ),

    addFriendById: authenticated(
        async (_: any, { friendId }: { friendId: string }, ctx: IContext) => {
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
        }
    ),

    sendFriendRequest: authenticated(
        async (_: any, { matchId }: { matchId: string }, ctx: IContext) => {
            const user = ctx.currentUser
            if (!user) return false

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

            const numberOfInterests = await getUsersSharedInterests(user, match)
            sendInviteEmail({
                to: match.email,
                data: {
                    matchName: match.profile.name?.split(' ')[0],
                    interestsCount: numberOfInterests?.length || 0,
                },
            })

            return true
        }
    ),

    respondToFriendRequest: authenticated(
        async (_: any, data: { matchId: string; accepted: boolean }, ctx: IContext) => {
            const user = ctx.currentUser
            if (!user) return false

            // get user sending request
            const requestingUser = await User.findOne({ _id: data.matchId })
            if (!requestingUser) return false
            if (requestingUser.id === user.id) return false

            if (data.accepted) {
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
        }
    ),
}
