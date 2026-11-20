"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const handler_name_1 = require("./handler-name");
const privileges_1 = require("./privileges");
const table_1 = require("./table");
const user_1 = require("./user");
const HANDLERS = {
    [handler_name_1.HandlerName.Table]: table_1.handler,
    [handler_name_1.HandlerName.User]: user_1.handler,
    [handler_name_1.HandlerName.UserTablePrivileges]: privileges_1.handler,
};
async function handler(event) {
    const subHandler = HANDLERS[event.ResourceProperties.handler];
    if (!subHandler) {
        throw new Error(`Requested handler ${event.ResourceProperties.handler} is not in supported set: ${JSON.stringify(Object.keys(HANDLERS))}`);
    }
    return subHandler(event.ResourceProperties, event);
}
