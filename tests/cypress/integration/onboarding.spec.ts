describe.skip("Onboarding Flow", () => {
    beforeEach(() => {
        cy.server()

        cy.visit("/app/onboarding")
    })

    it("onboards user", () => {})
})
