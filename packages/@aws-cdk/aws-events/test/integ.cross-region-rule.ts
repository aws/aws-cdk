import { App, Arn, CfnResource, Stack } from '@aws-cdk/core';
import { AwsApiCall, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests';
import { IRuleTarget, Rule } from '../lib';

const app = new App();

const integAccount = process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;
const integRegion = process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION;

// Deploy target stack in the same environment as the integration test
// so the queue can be called by the assertions.
const targetStack = new Stack(app, 'TargetStack', {
  env: {
    account: integAccount,
    region: integRegion,
  },
});
// Make sure source stack is deployed in a different environment than the target stack
// to test cross-environment EventBridge rules.
// If target is deployed in us-east-1, source deploys in eu-west-1.
// If target is NOT deployed in us-east-1, deploy source there.
const sourceStack = new Stack(app, 'SourceStack', {
  env: {
    account: integAccount,
    region: (integRegion === 'us-east-1') ? 'eu-west-1' : 'us-east-1',
  },
});

const queueName = 'IntegTestCrossEnvRule';

const queue = new CfnResource(targetStack, 'Queue', {
  type: 'AWS::SQS::Queue',
  properties: {
    QueueName: queueName,
    ReceiveMessageWaitTimeSeconds: 20,
  },
});
new CfnResource(targetStack, 'QueuePolicy', {
  type: 'AWS::SQS::QueuePolicy',
  properties: {
    PolicyDocument: {
      Statement: [{
        Effect: 'Allow',
        Principal: {
          Service: 'events.amazonaws.com',
        },
        Action: 'sqs:SendMessage',
        Resource: queue.getAtt('Arn'),
      }],
    },
    Queues: [queue.ref],
  },
});

const target: IRuleTarget = {
  bind: () => ({
    id: 'SQS',
    arn: Arn.format({
      resource: queueName,
      service: 'sqs',
    }, targetStack),
    targetResource: queue,
  }),
};

const rule = new Rule(sourceStack, 'MyRule', {
  eventPattern: {
    detail: {
      foo: ['bar'],
    },
    detailType: ['cdk-integ-custom-rule'],
    source: ['cdk-integ'],
  },
  targets: [target],
});

const putEventsCall = new AwsApiCall(
  sourceStack,
  'PutEventsCall',
  {
    service: 'EventBridge',
    api: 'putEvents',
    parameters: {
      Entries: [
        {
          Detail: JSON.stringify({
            foo: 'bar',
          }),
          DetailType: 'cdk-integ-custom-rule',
          Source: 'cdk-integ',
        },
      ],
    },
  },
);
putEventsCall.provider.addPolicyStatementFromSdkCall('events', 'PutEvents');

// Make sure PutEvents is called AFTER the rule is ready to pick it up
putEventsCall.node.addDependency(rule);

const integ = new IntegTest(app, 'IntegTest-CrossEnvRule', {
  testCases: [targetStack],
});

const receiveMessage = integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: `https://sqs.${targetStack.region}.amazonaws.com/${targetStack.account}/${queueName}`,
  WaitTimeSeconds: 20,
});
receiveMessage.assertAtPath('Messages.0.Body.source', ExpectedResult.stringLikeRegexp('cdk-integ'));

/*
Enforce the order:
- Target stack deploys
- Source stack deploys and calls PutEvents
- IntegStack assertions deploy and test the message was received in the queue cross-region
*/
sourceStack.addDependency(targetStack);
integ.node.addDependency(sourceStack);

app.synth();
