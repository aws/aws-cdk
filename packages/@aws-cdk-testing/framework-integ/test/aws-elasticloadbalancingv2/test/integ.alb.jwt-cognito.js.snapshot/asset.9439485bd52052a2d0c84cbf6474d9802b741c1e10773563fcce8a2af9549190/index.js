"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/* eslint-disable @typescript-eslint/no-require-imports */
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const https = require("https");
const handler = async (_event) => {
    const cognitoClient = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({});
    // Authenticate with Cognito to get JWT
    const authResponse = await cognitoClient.send(new client_cognito_identity_provider_1.AdminInitiateAuthCommand({
        UserPoolId: process.env.USER_POOL_ID,
        ClientId: process.env.CLIENT_ID,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
            USERNAME: process.env.TEST_USERNAME,
            PASSWORD: process.env.TEST_PASSWORD,
        },
    }));
    const idToken = authResponse.AuthenticationResult.IdToken;
    // Make HTTPS request to ALB with JWT token in Authorization header
    return new Promise((resolve, reject) => {
        const req = https.get(process.env.TEST_URL, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(body));
        });
        req.on('error', reject);
    });
};
exports.handler = handler;
