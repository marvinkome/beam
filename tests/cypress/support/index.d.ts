/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        mockGraphql(value: any): any
        mockGraphqlOps(value: any): any

        setup(pageUrl: string, visitOptions?: Partial<Cypress.VisitOptions>): any
    }
}
