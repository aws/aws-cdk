/* eslint-disable no-console */

export const handler = async (event: AWSLambda.APIGatewayProxyEventV2) => {
  const key = event.headers['X-API-Key'];

  return {
    isAuthorized: key === '123',
  };
};