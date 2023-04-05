/* eslint-disable no-console */

export const handler = async (event: any, _context: any = {}): Promise<any> => {
  const authToken: string = event.headers.Authorization;
  const authQueryString: string = event.queryStringParameters.allow;
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
  } else {
    throw new Error('Unauthorized');
  }
};
