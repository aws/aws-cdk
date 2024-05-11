import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-events-targets-api-destination-integ');

const secret = new secretsmanager.Secret(stack, 'MySecret', {
  secretStringValue: cdk.SecretValue.unsafePlainText('abc123'),
});

const connection = new events.Connection(stack, 'MyConnection', {
  authorization: events.Authorization.apiKey('x-api-key', secret.secretValue),
  description: 'Connection with API Key x-api-key',
  connectionName: 'MyConnection',
});

const destination = new events.ApiDestination(stack, 'MyDestination', {
  connection,
  endpoint: 'https://httpbin.org/headers',
  httpMethod: events.HttpMethod.GET,
  apiDestinationName: 'MyDestination',
  rateLimitPerSecond: 1,
  description: 'Calling example.com with API key x-api-key',
});

const rule = new events.Rule(stack, 'MyRule', {
  ruleName: 'MyRule',
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  targets: [
    new targets.ApiDestination(destination),
  ],
});

const importedConnection = events.Connection.fromConnectionAttributes(stack, 'ImportedConnection', {
  connectionArn: connection.connectionArn,
  connectionName: 'MyConnection',
  connectionSecretArn: secret.secretArn,
});

const importedDestination = events.ApiDestination.fromApiDestinationAttributes(stack, 'ImportedDestination', {
  apiDestinationArn: destination.apiDestinationArn,
  connection: importedConnection,
});

const otherRule = new events.Rule(stack, 'MyOtherRule', {
  ruleName: 'MyOtherRule',
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  targets: [new targets.ApiDestination(importedDestination)],
});
otherRule.addTarget(new targets.ApiDestination(importedDestination));

const testCase = new IntegTest(app, 'ApiDestinationTarget', {
  testCases: [stack],
});

// describe the results of the execution
for (const { ruleName } of [rule, otherRule]) {
  const ruleDescription = testCase.assertions.awsApiCall(
    '@aws-sdk/client-eventbridge',
    'ListTargetsByRule',
    {
      Rule: ruleName,
      EventBusName: 'default',
      Limit: 1,
    },
  );

  // assert the results
  ruleDescription.expect(
    ExpectedResult.objectLike({
      Targets: [
        {
          Arn: destination.apiDestinationArn,
        },
      ],
    }),
  );
}

app.synth();
