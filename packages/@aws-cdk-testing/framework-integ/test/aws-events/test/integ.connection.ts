import { App, SecretValue, Stack } from 'aws-cdk-lib';
import { AssertionsProvider, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Authorization, Connection, HttpParameter } from 'aws-cdk-lib/aws-events';

const app = new App();

const stack = new Stack(app, 'IntegConnectionStack');

const connection = new Connection(stack, 'Connection', {
  authorization: Authorization.apiKey('keyname', SecretValue.unsafePlainText('keyvalue')),
  headerParameters: {
    'content-type': HttpParameter.fromString('application/json'),
  },
});
const testCase = new IntegTest(app, 'ConnectionTest', {
  testCases: [stack],
});

const deployedConncention = testCase.assertions.awsApiCall('EventBridge', 'describeConnection', { Name: connection.connectionName });

deployedConncention.expect(ExpectedResult.objectLike({
  AuthParameters: {
    ApiKeyAuthParameters: {
      ApiKeyName: 'keyname',
    },
    InvocationHttpParameters: {
      HeaderParameters: [
        {
          Key: 'content-type',
          Value: 'application/json',
          IsValueSecret: false,
        },
      ],
    },
  },
}));

const assertionProvider = deployedConncention.node.tryFindChild('SdkProvider') as AssertionsProvider;
assertionProvider.addPolicyStatementFromSdkCall('events', 'DescribeConnection');
