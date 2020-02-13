// tslint:disable:no-console

export const handler = async (event: any, _context: any = {}): Promise<any> => {
  const httpMethod: string = event.requestContext.httpMethod;
  console.log(`event.requestContext.httpMethod = ${httpMethod}`);
  if (httpMethod === 'GET') {
    return {
      principalId: 'user',
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: 'Allow',
            Resource: event.methodArn
          }
        ]
      }
    };
  } else {
    throw new Error('Unauthorized');
  }
};
