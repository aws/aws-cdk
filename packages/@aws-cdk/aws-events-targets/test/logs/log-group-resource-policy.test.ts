import '@aws-cdk/assert-internal/jest';
import * as iam from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import { LogGroupResourcePolicy } from '../../lib/log-group-resource-policy';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('minimal example renders correctly', () => {
  new LogGroupResourcePolicy(stack, 'LogGroupResourcePolicy', {
    policyName: 'TestPolicy',
    policyStatements: [new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['logs:PutLogEvents', 'logs:CreateLogStream'],
      resources: ['*'],
      principals: [new iam.ServicePrincipal('es.amazonaws.com')],
    })],
  });

  expect(stack).toHaveResource('Custom::CloudwatchLogResourcePolicy', {
    ServiceToken: {
      'Fn::GetAtt': [
        'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
        'Arn',
      ],
    },
    Create: '{"service":"CloudWatchLogs","action":"putResourcePolicy","parameters":{"policyName":"TestPolicy","policyDocument":"{\\"Statement\\":[{\\"Action\\":[\\"logs:PutLogEvents\\",\\"logs:CreateLogStream\\"],\\"Effect\\":\\"Allow\\",\\"Principal\\":{\\"Service\\":\\"es.amazonaws.com\\"},\\"Resource\\":\\"*\\"}],\\"Version\\":\\"2012-10-17\\"}"},"physicalResourceId":{"id":"LogGroupResourcePolicy"}}',
    Update: '{"service":"CloudWatchLogs","action":"putResourcePolicy","parameters":{"policyName":"TestPolicy","policyDocument":"{\\"Statement\\":[{\\"Action\\":[\\"logs:PutLogEvents\\",\\"logs:CreateLogStream\\"],\\"Effect\\":\\"Allow\\",\\"Principal\\":{\\"Service\\":\\"es.amazonaws.com\\"},\\"Resource\\":\\"*\\"}],\\"Version\\":\\"2012-10-17\\"}"},"physicalResourceId":{"id":"LogGroupResourcePolicy"}}',
    Delete: '{"service":"CloudWatchLogs","action":"deleteResourcePolicy","parameters":{"policyName":"TestPolicy"},"ignoreErrorCodesMatching":"400"}',
  });
});
