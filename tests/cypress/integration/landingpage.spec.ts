describe("Landing page", () => {
    beforeEach(() => {
        cy.server()

        cy.visit("/", {
            onBeforeLoad(win) {
                cy.stub(win, "open", (url) => {
                    expect(url).to.contain("https://accounts.google.com")
                }).as("loginPopup")
            },
        })

        cy.window().its("gapi").should("not.be.undefined")
    })

    it("loads page <snapshot>", () => {
        // @ts-ignore
        cy.get(".landing-page").toMatchSnapshot()
    })

    it("opens google sign up popup - header", () => {
        cy.get(".header-grid .btn.btn-primary").click()
        cy.get("@loginPopup").should("be.called")
    })

    it("opens google sign up popup - textbox", () => {
        cy.get(".text-box-cta .btn").click()
        cy.get("@loginPopup").should("be.called")
    })
})
