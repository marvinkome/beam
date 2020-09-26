describe("Registration flow", () => {
    beforeEach(() => {
        // fixtures
        cy.fixture("connect-accounts/youtube.json").as("youtubeSubsJSON")
        cy.fixture("connect-accounts/spotify.json").as("spotifyDataJSON")
        cy.fixture("connect-accounts/reddit.json").as("redditDataJSON")

        cy.setup("/", {
            onBeforeLoad(win) {
                // stub browser permissions
                cy.stub(win.navigator.geolocation, "getCurrentPosition", (cb) => {
                    return cb({
                        coords: {
                            accuracy: 51528,
                            altitude: null,
                            altitudeAccuracy: null,
                            heading: null,
                            latitude: 6.4487423999999995,
                            longitude: 3.4701312,
                            speed: null,
                        },
                        timestamp: 1600955261472,
                    })
                })

                // @ts-ignore
                cy.stub(win.Notification, "requestPermission").resolves("granted")

                cy.stub(win, "open", (url) => {
                    if (url.includes("about:blank")) {
                        return {
                            closed: false,
                            location: {
                                href: "fake-url",
                                hash:
                                    "#access_token=fake_access_token&token_type=Bearer&expires_in=3600",
                            },
                        }
                    }
                })
            },
        })
    })

    it("Complete sign up and onboarding flow", () => {
        // ========== SETUP MOCKS ============= //
        // mock youtube subscriptions
        cy.route(
            /https:\/\/www.googleapis.com\/youtube\/v3\/subscriptions*/,
            "@youtubeSubsJSON"
        ).as("youtubeSubsAPI")

        // mock spotify artists
        cy.route(/https:\/\/api.spotify.com\/v1\/me\/top\/artists*/, "@spotifyDataJSON").as(
            "spotifyDataAPI"
        )

        // mock reddit subreddits
        cy.route(/https:\/\/oauth.reddit.com\/subreddits\/mine\/subscriber*/, "@redditDataJSON").as(
            "redditDataAPI"
        )

        // mock google login
        cy.window()
            .its("gapi")
            .its("auth2")
            .then((auth2) => {
                // create mock response
                const res = {
                    getBasicProfile: () => ({
                        getId: () => "randomGoogleId",
                        getImageUrl: () => "image-url",
                        getEmail: () => "johndoe@gmail.com",
                        getName: () => "John Doe",
                        getGivenName: () => "John",
                        getFamilyName: () => "Doe",
                    }),
                    getAuthResponse: () => ({
                        id_token: "id_token",
                        access_token: "my-access-token",
                    }),
                }

                // mock sign in method
                cy.stub(auth2, "getAuthInstance").returns({
                    signIn: () => new Promise((resolve) => resolve(res)),
                })
            })

        // mock reddit oauth

        // get button and wait for it to be enabled
        cy.get(".btn.btn-primary", { timeout: 5000 })
            .should("have.length", 1)
            .should("not.have.class", "disabled")
            .then(() =>
                // @ts-ignore
                cy.get(".landing-page").snapshot({
                    name: "landing page",
                    json: false,
                })
            )

        cy.get(".btn.btn-primary").click()

        // expect redirect
        cy.url()
            .should("include", "/app/onboarding")
            .then(() => {
                expect(localStorage.getItem("Beam_Auth_Token_Dev")).exist
            })

        cy.get(".btn.btn-primary", { timeout: 5000 }).should("have.text", "Continue")

        // @ts-ignore
        cy.get(".onboarding-page").snapshot({
            name: "onboarding page",
            json: false,
        })

        // connect youtube account
        cy.get("div.account.youtube").click()
        cy.get("div.account.youtube .loader").should("exist")

        // after connect
        cy.wait("@youtubeSubsAPI", { timeout: 7000 }).its("status").should("eq", 200)
        cy.get("div.account.youtube .loader").should("not.exist")

        // connect spotify
        cy.get("div.account.spotify").click()
        cy.window().its("open").should("be.called")
        cy.get("div.account.spotify .loader").should("exist")

        // after connect
        cy.wait("@spotifyDataAPI").its("status").should("eq", 200)
        cy.get("div.account.spotify .loader").should("not.exist")

        // connect reddit
        cy.get("div.account.reddit").click()
        cy.window().its("open").should("be.called")
        cy.get("div.account.reddit .loader").should("exist")

        // after connect
        cy.wait("@redditDataAPI").its("status").should("eq", 200)
        cy.get("div.account.reddit .loader").should("not.exist")

        // wait for find friends
        cy.wait(2000)
        cy.get("a[href='/app/profile']").should("have.length", 1)

        // @ts-ignore
        cy.get(".find-friends-page").snapshot({
            name: "find friends page",
            json: false,
        })

        // friend check and action
        cy.get(".suggested-friend-card").should("have.length", 1)
        cy.get(".suggested-friend-card .btn-primary").click()

        cy.get(".suggested-friend-card .btn-primary-outline").should("contain.text", "Invite sent")

        // continue to chat
        cy.get(".btn-primary").contains("Continue to chat").click()

        cy.url().should("include", "/app/chats")
    })
})
