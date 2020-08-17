import createApp from './src'

const { server, apolloServer } = createApp()
const port = process.env.PORT || 5055

server.listen(port, () => {
    console.log(`🚀 App is running on localhost:${port}`)
    console.log(`🚀 GraphQL server running on http://localhost:${port}${apolloServer.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${port}${apolloServer.subscriptionsPath}`)
})
