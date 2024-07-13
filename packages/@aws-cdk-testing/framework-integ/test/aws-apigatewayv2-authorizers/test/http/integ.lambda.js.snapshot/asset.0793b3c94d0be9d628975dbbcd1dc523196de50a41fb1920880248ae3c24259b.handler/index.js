"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello from authenticated lambda' }),
        headers: {
            'Content-Type': 'application/json',
        },
    };
};
exports.handler = handler;
