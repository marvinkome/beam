import { gql } from 'apollo-server-express'

export const subscriptionTypeDef = gql`
    type Subscription {
        messageSent(friendId: ID, groupId: ID, shouldNotFilter: Boolean): Message
        lastSeen(friendId: ID!): String
    }
`
