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

    type User {
        id: ID!
        email: String!
        connectedAccounts: ConnectedAccounts
        profile: Profile
        lastSeen: String
        bot: Boolean
        lastMessage: Message
    }
`
