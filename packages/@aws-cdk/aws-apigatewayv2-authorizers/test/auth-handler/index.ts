/* eslint-disable no-console */

export const handler = async (event: AWSLambda.APIGatewayProxyEventV2) => {
  const key = event.headers['x-api-key'];

  return {
    isAuthorized: key === '123',
  };
};