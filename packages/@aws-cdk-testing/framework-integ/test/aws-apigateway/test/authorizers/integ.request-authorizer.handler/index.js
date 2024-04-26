"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event, _context = {}) => {
    const authToken = event.headers.Authorization;
    const authQueryString = event.queryStringParameters.allow;
    console.log(`event.headers.Authorization = ${authToken}`);
    console.log(`event.queryStringParameters.allow = ${authQueryString}`);
    if ((authToken === 'allow' || authToken === 'deny') && authQueryString === 'yes') {
        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: authToken,
                        Resource: event.methodArn,
                    },
                ],
            },
        };
    }
    else {
        throw new Error('Unauthorized');
    }
};
exports.handler = handler;
