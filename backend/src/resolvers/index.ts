import { queryResolver } from './query'
import { userResolvers } from './user'
import { messageResolvers } from './message'
import { groupResolvers } from './group'
import { mutationResolvers } from './mutation'
import { converationResolvers } from './conversation'
import { subscriptionResolver } from './subscription'

export const resolvers = [
    queryResolver,
    mutationResolvers,
    subscriptionResolver,
    userResolvers,
    messageResolvers,
    converationResolvers,
    groupResolvers,
]
