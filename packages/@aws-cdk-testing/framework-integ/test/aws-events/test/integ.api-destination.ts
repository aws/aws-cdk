import { App, CfnOutput, SecretValue, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as events from 'aws-cdk-lib/aws-events';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

const app = new App();

const stack = new Stack(app, 'events-api-destination-stack');

const secret = new secretsmanager.Secret(stack, 'Secret', {
  secretStringValue: SecretValue.unsafePlainText('abc123'),
});

const connection = new events.Connection(stack, 'Connection', {
  authorization: events.Authorization.apiKey('x-api-key', secret.secretValue),
  description: 'Connection with API Key x-api-key',
  connectionName: 'MyConnection',
});

const destination = new events.ApiDestination(stack, 'Destination', {
  connection,
  endpoint: 'https://httpbin.org/headers',
  httpMethod: events.HttpMethod.GET,
  apiDestinationName: 'MyDestination',
  rateLimitPerSecond: 1,
  description: 'Calling example.com with API key x-api-key',
});

// arn:aws:events:{region}:{account}:api-destination/{destination-name}/11111111-1111-1111-1111-111111111111
new CfnOutput(stack, 'DestinationArn', {
  value: destination.apiDestinationArn,
  description: 'The ARN of the API destination',
});
// arn:aws:events:{region}:{account}:api-destination/{destination-name}
new CfnOutput(stack, 'DestinationArnForPolicy', {
  value: destination.apiDestinationArnForPolicy || '',
  description: 'The ARN of the API destination in resource format',
});

new IntegTest(app, 'events-api-destination-integ', {
  testCases: [stack],
});
