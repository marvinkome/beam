import schema from "../fixtures/schema.json"
const serverUrl = Cypress.env("serverUrl")

describe("Landing page", () => {
    beforeEach(() => {
        // fixtures
        cy.fixture("connect-accounts/youtube.json").as("youtubeSubsJSON")
        cy.server()

        // setup mock server
        cy.server()
        cy.mockGraphql({ schema, endpoint: `${serverUrl}/graphql` }).as("mockGraphqlOps")

        cy.visit("/")
    })

    it("loads page <snapshot>", () => {
        // @ts-ignore
        cy.get(".landing-page").toMatchSnapshot()
    })

    it("sign up with google", () => {
        // mock login mutation
        cy.mockGraphqlOps({
            operations: {
                GoogleLogin: {
                    googleLogin: {
                        success: true,
                        token: "auth-token",
                        user: {
                            id: "user-id",
                            email: "user@test.com",
                            createdAt: "2020-09-22T13:33:59.825Z",
                            hasConnectedAccount: false,
                        },
                    },
                },
            },
        })

        // mock connect youtube mutation
        cy.mockGraphqlOps({
            operations: {
                ConnectAccount: {
                    connectAccount: true,
                },
            },
        })

        // mock youtube subscriptions
        cy.route(
            /https:\/\/www.googleapis.com\/youtube\/v3\/subscriptions*/,
            "@youtubeSubsJSON"
        ).as("youtubeSubsAPI")

        // get button and wait for it to be enabled
        cy.get(".btn.btn-primary", { timeout: 5000 })
            .should("have.length", 1)
            .should("not.have.class", "disabled")

        // mock google login
        cy.window()
            .its("gapi")
            .then((gapi) => {
                // expect object to be defined
                expect(gapi).to.have.property("auth2")

                // create mock response
                const res = {
                    getBasicProfile: () => ({
                        getId: () => "mock-google-id",
                        getImageUrl: () => "image-url",
                        getEmail: () => "email@test.com",
                        getName: () => "name",
                        getGivenName: () => "given name",
                        getFamilyName: () => "family name",
                    }),
                    getAuthResponse: () => ({
                        id_token: "id_token",
                        access_token: "my-access-token",
                    }),
                }

                // mock sign in method
                cy.stub(gapi.auth2, "getAuthInstance").returns({
                    signIn: () => new Promise((resolve) => resolve(res)),
                })
            })

        cy.get(".btn.btn-primary").click()

        // expect redirect
        cy.url().should("include", "/app/onboarding")
    })

    it("login with google", () => {
        // mock login mutation
        cy.mockGraphqlOps({
            operations: {
                GoogleLogin: {
                    googleLogin: {
                        success: true,
                        token: "auth-token",
                        user: {
                            id: "user-id",
                            email: "user@test.com",
                            createdAt: "2020-09-22T13:33:59.825Z",
                            hasConnectedAccount: true,
                        },
                    },
                },
            },
        })

        // get login link and wait for it to be enabled
        cy.get(".header-cta .link-button", { timeout: 5000 })
            .should("have.length", 1)
            .should("not.have.class", "disabled")

        // mock google login
        cy.window()
            .its("gapi")
            .then((gapi) => {
                // expect object to be defined
                expect(gapi).to.have.property("auth2")

                // create mock response
                const res = {
                    getBasicProfile: () => ({
                        getId: () => "mock-google-id",
                        getImageUrl: () => "image-url",
                        getEmail: () => "email@test.com",
                        getName: () => "name",
                        getGivenName: () => "given name",
                        getFamilyName: () => "family name",
                    }),
                    getAuthResponse: () => ({
                        id_token: "id_token",
                        access_token: "my-access-token",
                    }),
                }

                // mock sign in method
                cy.stub(gapi.auth2, "getAuthInstance").returns({
                    signIn: () => new Promise((resolve) => resolve(res)),
                })
            })

        cy.get(".header-cta .link-button").click()

        // expect redirect
        cy.url().should("include", "/app/chats")
    })
})
