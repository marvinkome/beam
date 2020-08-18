describe("Onboarding Flow", () => {
    beforeEach(() => {
        cy.server()

        // cy.setCookie()
        cy.visit("/app/onboarding")
    })

    it("onboards user", () => {})
})
