import { gql } from 'apollo-server-express'

export const queryTypeDef = gql`
    type SharedInterest {
        id: String
        name: String
        image: String
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
        groups: [Group]

        suggestedFriends: [SuggestedFriend]

        conversation(with: ID!): Conversation
        group(id: ID!): Group
    }
`
