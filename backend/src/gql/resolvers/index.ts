import { queryResolver } from './query'
import { userResolvers } from './user'
import { messageResolvers } from './message'
import { mutationResolvers } from './mutation'
import { subscriptionResolver } from './subscription'

export const resolvers = [
    queryResolver,
    mutationResolvers,
    subscriptionResolver,
    userResolvers,
    messageResolvers,
]
