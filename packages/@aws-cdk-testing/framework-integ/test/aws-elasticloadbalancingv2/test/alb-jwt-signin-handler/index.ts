/* eslint-disable @typescript-eslint/no-require-imports */
import { CognitoIdentityProviderClient, AdminInitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import * as https from 'https';

export const handler: AWSLambda.Handler = async (_event) => {
  const cognitoClient = new CognitoIdentityProviderClient({});

  // Authenticate with Cognito to get JWT
  const authResponse = await cognitoClient.send(new AdminInitiateAuthCommand({
    UserPoolId: process.env.USER_POOL_ID,
    ClientId: process.env.CLIENT_ID,
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: process.env.TEST_USERNAME!,
      PASSWORD: process.env.TEST_PASSWORD!,
    },
  }));

  const idToken = authResponse.AuthenticationResult!.IdToken!;

  // Make HTTPS request to ALB with JWT token in Authorization header
  return new Promise<string>((resolve, reject) => {
    const req = https.get(process.env.TEST_URL!, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }, (res) => {
      let body = '';
      res.on('data', (chunk: string) => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
  });
};
