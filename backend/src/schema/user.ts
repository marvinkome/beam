import { gql } from 'apollo-server-express'

export const userTypeDefs = gql`
    enum ConnectedAccountType {
        spotify
        reddit
        youtube
    }

    # QUERIES
    type Location {
        city: String
        state: String
        country: String
    }

    type ConnectedAccounts {
        youtube: Boolean
        spotify: Boolean
        reddit: Boolean
    }

    type Profile {
        name: String
        firstName: String
        picture: String
        location: Location
    }

    type Interest {
        id: String
        name: String
        image: String
        platform: String
        group: Group
    }

    type Request {
        from: User
        date: String
        sharedInterests: [SharedInterest]
    }

    type User {
        id: ID!
        email: String!
        createdAt: String
        profile: Profile

        connectedAccounts: ConnectedAccounts
        interests: [Interest]

        requests: [Request]
        requestsCount: Int

        bot: Boolean
        notificationToken: String

        # chat information
        lastSeen: String
        lastMessage: Message # last message with current user
        unreadCount: Int
    }
`
