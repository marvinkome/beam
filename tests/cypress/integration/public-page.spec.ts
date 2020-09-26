import { should } from "chai"

describe("Public pages tests", () => {
    it("loads privacy policy Ppge <snapshot>", () => {
        cy.visit("/privacy-policy")

        // @ts-ignore
        cy.get(".privacy-policy").snapshot({
            name: "privacy policy page",
            json: false,
        })
    })

    it("loads terms page <snapshot>", () => {
        cy.visit("/terms-and-condition")

        // @ts-ignore
        cy.get(".terms").snapshot({
            name: "terms page",
            json: false,
        })
    })

    it("loads acceptable use page <snapshot>", () => {
        cy.visit("/acceptable-use")

        // @ts-ignore
        cy.get(".terms").snapshot({
            name: "acceptable use page",
            json: false,
        })
    })
})
