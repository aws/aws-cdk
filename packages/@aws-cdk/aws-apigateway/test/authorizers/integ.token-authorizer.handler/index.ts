// tslint:disable

export const handler = async (event: any, _context: any = {}): Promise<any> => {
  const authToken: string = event.authorizationToken;
  console.log(`event.authorizationToken = ${authToken}`);
  if (authToken === 'allow' || authToken === 'deny') {
    return {
      principalId: 'user',
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: authToken.charAt(0).toUpperCase() + authToken.substring(1), // capitalize first char
            Resource: event.methodArn
          }
        ]
      }
    };
  } else {
    throw new Error(`Pass in header of x-auth-header=allow or x-auth-header=deny to check corresponding authorization of the API`);
  }
};