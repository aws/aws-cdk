export const username = 'integ-username';
export const password = 'integ-password';

const base64Encode = (value: string) => Buffer.from(value).toString('base64');

export const handler = async (event: { authorizationToken: string }) => {
  const token = event.authorizationToken;
  const encoded = base64Encode(`${username}:${password}`);
  const effect = token === `Basic ${encoded}` ? 'Allow' : 'Deny';

  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: '*',
        },
      ],
    },
  };
};
