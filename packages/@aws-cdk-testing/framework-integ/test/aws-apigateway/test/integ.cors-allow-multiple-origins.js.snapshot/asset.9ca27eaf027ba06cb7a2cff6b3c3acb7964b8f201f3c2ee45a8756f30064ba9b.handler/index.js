"use strict";
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
