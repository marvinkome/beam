/// <reference types="cypress" />
const serverUrl = Cypress.env("serverUrl")

Cypress.Commands.add("setup", (pageUrl, visitOptions) => {
    cy.request("GET", `${serverUrl}/test/clean-db`)

    cy.server()
    cy.visit(pageUrl, visitOptions)
})

require("@cypress/snapshot").register()
