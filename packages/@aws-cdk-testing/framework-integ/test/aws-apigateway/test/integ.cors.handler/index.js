"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = async (evt) => {
    console.error(JSON.stringify(evt, undefined, 2));
    return {
        statusCode: 200,
        body: 'hello, cors!',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    };
};
