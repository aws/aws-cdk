"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event, _context = {}) => {
    const authToken = event.authorizationToken;
    console.log(`event.authorizationToken = ${authToken}`);
    if (authToken === 'allow' || authToken === 'deny') {
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
