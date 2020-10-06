import { gql } from 'apollo-server-express'

export const mutationTypeDefs = gql`
    # INPUTS
    input LoginInput {
        id: String
        authType: String

        email: String!
        name: String!
        picture: String
    }

    input YoutubeInput {
        name: String!
        id: String!
        image: String
    }

    input RedditInput {
        name: String!
        id: String!
        image: String
    }

    input ArtistsInput {
        name: String!
        id: String!
    }

    input ConnectAccountInput {
        account: ConnectedAccountType!

        # if it's youtube we need subs
        subs: [YoutubeInput]

        # if it's reddit we need subreddits
        subreddits: [RedditInput]

        # if it's spotify we need artists and genres
        artists: [ArtistsInput]
        genres: [String]
    }

    input LocationInput {
        lat: Float
        long: Float
    }

    # MUTATIONS RESPONSES
    type LoginMutationResponse {
        success: Boolean!
        message: String
        token: String
        user: User
    }

    type SendMessageMutationResponse {
        code: String!
        success: Boolean!
        message: String
        sentMessage: Message
    }

    type AddFriendMutationResponse {
        code: String!
        success: Boolean!
        message: String
    }

    type GroupMutationResponse {
        success: Boolean!
        message: String!
        group: Group
    }

    type Mutation {
        # AUTH
        googleLogin(token: String!, inviteToken: String): LoginMutationResponse
        facebookLogin(token: String!, inviteToken: String): LoginMutationResponse
        login(authData: LoginInput, inviteToken: String): LoginMutationResponse

        # USER
        connectAccount(input: ConnectAccountInput): Boolean
        disconnectAccount(account: String!): Boolean

        setLocation(location: LocationInput): User
        setNotificationToken(token: String!): Boolean
        setProfilePicture(pictureUri: String!): User

        createInviteLink: String
        addFriend(inviteToken: String!): AddFriendMutationResponse

        addFriendById(friendId: ID!): Boolean

        sendFriendRequest(matchId: ID!): Boolean
        respondToFriendRequest(matchId: ID!, accepted: Boolean!): Boolean

        # CHATS
        setViewConversation(viewing: Boolean, id: ID!): Boolean
        setViewGroup(viewing: Boolean, id: ID!): Boolean

        # GROUP
        createGroup(interestId: ID!): GroupMutationResponse
        joinGroup(groupId: ID!): GroupMutationResponse
        leaveGroup(groupId: ID!): Boolean

        # MESSAGING
        sendMessage(to: ID!, message: String!): SendMessageMutationResponse
        sendMessageToGroup(to: ID!, message: String!): SendMessageMutationResponse
    }
`
