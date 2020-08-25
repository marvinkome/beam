import { gql } from 'apollo-server-express'

export const queryTypeDef = gql`
    type SharedInterest {
        name: String
        platform: String
    }

    type SuggestedFriend {
        friend: User
        sharedInterests: [SharedInterest]
    }

    type Query {
        me: User

        friend(id: ID!): User
        friends: [User]
        suggestedFriend: SuggestedFriend

        conversation(with: ID!, first: Int, sort: Boolean, after: Int): [Message]
        group(id: ID!): Group
    }
`
