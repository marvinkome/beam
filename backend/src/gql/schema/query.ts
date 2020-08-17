import { gql } from 'apollo-server-express'

export const queryTypeDef = gql`
    type Interest {
        name: String
        platform: String
    }

    type SuggestedFriend {
        friend: User
        sharedInterests: [Interest]
    }

    type Query {
        me: User
        friend(id: ID!): User
        friends: [User]
        conversation(with: ID!, first: Int, sort: Boolean, after: Int): [Message]
        suggestedFriend: SuggestedFriend
    }
`
