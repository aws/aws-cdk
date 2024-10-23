"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event) => {
    const key = event.headers['x-api-key'];
    return {
        isAuthorized: key === '123',
    };
};
exports.handler = handler;
