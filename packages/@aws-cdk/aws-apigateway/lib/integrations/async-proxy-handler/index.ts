// tslint:disable:no-console
import AWS = require('aws-sdk');

export async function handler(event: any): Promise<AWSLambda.APIGatewayProxyResult> {
  try {
    if (!process.env.TARGET_FUNCTION_NAME) {
      throw new Error('Missing `TARGET_FUNCTION_NAME`');
    }

    const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

    await lambda.invoke({
      FunctionName: process.env.TARGET_FUNCTION_NAME,
      InvocationType: 'Event',
      Payload: JSON.stringify(event)
    }).promise();

    return { statusCode: 202, body: '' };
  } catch (err) {
    return { statusCode: 500, body: '' };
  }
}
