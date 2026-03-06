"use strict";
exports.handler = async (evt) => {
    console.error(JSON.stringify(evt, undefined, 2));
    return 'hello, world!';
};
