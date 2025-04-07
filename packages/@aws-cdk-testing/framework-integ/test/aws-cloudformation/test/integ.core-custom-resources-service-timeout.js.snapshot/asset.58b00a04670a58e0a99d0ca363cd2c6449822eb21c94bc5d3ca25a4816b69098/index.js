"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
function handler(event) {
    console.log('I am a custom resource');
    console.log({ ...event, ResponseURL: undefined });
    return {
        PhysicalResourceId: event.ResourceProperties.physicalResourceId,
        Data: event.ResourceProperties.attributes,
    };
}
exports.handler = handler;
