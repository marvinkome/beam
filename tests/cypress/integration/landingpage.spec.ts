describe("Landing page", () => {
    beforeEach(() => {
        cy.server()

        cy.visit("/")
    })

    it("loads page <snapshot>", () => {
        // @ts-ignore
        cy.get(".landing-page").toMatchSnapshot()
    })
})
