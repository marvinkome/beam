/// <reference types="cypress" />
const { initPlugin } = require("cypress-plugin-snapshots/plugin")

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
    // code coverage
    require("@cypress/code-coverage/task")(on, config)

    // snapshots
    initPlugin(on, config)

    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    return config
}
