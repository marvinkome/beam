import { queryTypeDef } from './query'
import { mutationTypeDefs } from './mutation'
import { userTypeDefs } from './user'
import { messageTypeDefs } from './message'
import { groupTypeDefs } from './group'
import { subscriptionTypeDef } from './subscription'

export const typeDefs = [
    queryTypeDef,
    mutationTypeDefs,
    userTypeDefs,
    groupTypeDefs,
    messageTypeDefs,
    subscriptionTypeDef,
]
