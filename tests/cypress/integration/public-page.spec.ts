import { should } from "chai"

describe("Public pages tests", () => {
    it("loads privacy policy Ppge <snapshot>", () => {
        cy.visit("/privacy-policy")

        // @ts-ignore
        cy.get(".privacy-policy").toMatchSnapshot()
    })

    it("loads terms page <snapshot>", () => {
        cy.visit("/terms-and-condition")

        // @ts-ignore
        cy.get(".terms").toMatchSnapshot()
    })

    it("loads acceptable use page <snapshot>", () => {
        cy.visit("/acceptable-use")

        // @ts-ignore
        cy.get(".terms").toMatchSnapshot()
    })
})
