import User, { IUser } from '@models/users'
import { getUsersSharedInterests } from './helpers'

const WEIGHT = {
    youtube: 1,
    reddit: 1.5,
    spotify_genre: 1.75,
    spotify_artist: 2,
}

const MIN_SCORE = 1

// find friends by looping through everyone in your location
// then find sharedInterests with each user
// then calculate the interests weight
// sort by the weight
export async function findFriends(user: IUser) {
    const recommendedUsers = []

    // get the highest posible score
    const connectedAccounts = user.connectedAccounts
    if (!connectedAccounts) {
        return []
    }

    const closeUsers = await User.find({
        _id: {
            $ne: user.id,
            $nin: user.requests.map((req) => req.from).concat(user.friends),
        },
        'profile.location.state': user.profile.location?.state,
        'requests.from': { $nin: user.id },
        declinedRequests: { $nin: user.id },
    })

    for (const closeUser of closeUsers) {
        const sharedInterests = await getUsersSharedInterests(user, closeUser)
        if (!sharedInterests) {
            continue
        }

        const totalScore = sharedInterests.reduce((totalScore, currentInterest) => {
            if (currentInterest.platform === 'youtube') {
                totalScore += WEIGHT.youtube
            }

            if (currentInterest.platform === 'reddit') {
                totalScore += WEIGHT.reddit
            }

            if (currentInterest.platform === 'spotify' && currentInterest.type === 'artist') {
                totalScore += WEIGHT.spotify_artist
            }

            if (currentInterest.platform === 'spotify' && currentInterest.type === 'genre') {
                totalScore += WEIGHT.spotify_genre
            }

            return totalScore
        }, 0)

        if (totalScore >= MIN_SCORE) {
            recommendedUsers.push({
                totalScore,
                friend: closeUser,
                sharedInterests,
            })
        }
    }

    // sort based on score
    return recommendedUsers.sort((a, b) => {
        if (a.totalScore < b.totalScore) return 1
        if (a.totalScore > b.totalScore) return -1
        return 0
    })
}
