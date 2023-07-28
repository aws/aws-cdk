// eslint-disable-next-line import/no-unresolved
import { APIGatewayProxyHandler } from 'aws-lambda';

type NewType = APIGatewayProxyHandler;

export const handler: NewType = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello, world!',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};