import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import { LogGroupResourcePolicy } from '../lib/log-group-resource-policy';

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

  Template.fromStack(stack).hasResourceProperties('Custom::CloudwatchLogResourcePolicy', {
    ServiceToken: {
      'Fn::GetAtt': [
        'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
        'Arn',
      ],
    },
    Create: JSON.stringify({
      service: 'CloudWatchLogs',
      action: 'putResourcePolicy',
      parameters: {
        policyName: 'TestPolicy',
        policyDocument: '{"Statement":[{"Action":["logs:PutLogEvents","logs:CreateLogStream"],"Effect":"Allow","Principal":{"Service":"es.amazonaws.com"},"Resource":"*"}],"Version":"2012-10-17"}',
      },
      physicalResourceId: {
        id: 'LogGroupResourcePolicy',
      },
    }),
    Update: JSON.stringify({
      service: 'CloudWatchLogs',
      action: 'putResourcePolicy',
      parameters: {
        policyName: 'TestPolicy',
        policyDocument: '{"Statement":[{"Action":["logs:PutLogEvents","logs:CreateLogStream"],"Effect":"Allow","Principal":{"Service":"es.amazonaws.com"},"Resource":"*"}],"Version":"2012-10-17"}',
      },
      physicalResourceId: {
        id: 'LogGroupResourcePolicy',
      },
    }),
    Delete: JSON.stringify({
      service: 'CloudWatchLogs',
      action: 'deleteResourcePolicy',
      parameters: {
        policyName: 'TestPolicy',
      },
      ignoreErrorCodesMatching: 'ResourceNotFoundException',
    }),
  });
});
