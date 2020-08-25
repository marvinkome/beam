import { queryResolver } from './query'
import { userResolvers } from './user'
import { messageResolvers } from './message'
import { groupResolvers } from './group'
import { mutationResolvers } from './mutation'
import { subscriptionResolver } from './subscription'

export const resolvers = [
    queryResolver,
    mutationResolvers,
    subscriptionResolver,
    userResolvers,
    messageResolvers,
    groupResolvers,
]
