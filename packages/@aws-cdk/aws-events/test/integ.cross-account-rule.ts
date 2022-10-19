/// !cdk-integ *
import { App, Arn, CfnResource, Stack } from '@aws-cdk/core';
import { AwsApiCall, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests';
import { Rule, IRuleTarget } from '../lib';

const app = new App();

const account = process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || process.env.CDK_DEFAULT_CROSS_ACCOUNT;
const region = process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION;

const fromCrossAccountStack = new Stack(app, 'FromCrossAccountRuleStack', {
  env: {
    account,
    region,
  },
});

const toCrossAccountStack = new Stack(app, 'ToCrossAccountRuleStack', {
  env: {
    account: crossAccount,
    region,
  },
});
const queueName = 'IntegTestCrossEnvRule';

const queue = new CfnResource(toCrossAccountStack, 'Queue', {
  type: 'AWS::SQS::Queue',
  properties: {
    QueueName: queueName,
    ReceiveMessageWaitTimeSeconds: 20,
  },
});

const integ = new IntegTest(app, 'CrossAccountDeploy', {
  testCases: [
    fromCrossAccountStack,
  ],
});

new CfnResource(toCrossAccountStack, 'QueuePolicy', {
  type: 'AWS::SQS::QueuePolicy',
  properties: {
    PolicyDocument: {
      Statement: [{
        Effect: 'Allow',
        Principal: {
          Service: 'events.amazonaws.com',
          AWS: fromCrossAccountStack.account,
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
    }, toCrossAccountStack),
    targetResource: queue,
  }),
};

const rule = new Rule(fromCrossAccountStack, 'MyRule', {
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
  fromCrossAccountStack,
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

toCrossAccountStack.addDependency(fromCrossAccountStack);

const receiveMessage = integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: `https://sqs.${toCrossAccountStack.region}.amazonaws.com/${toCrossAccountStack.account}/${queueName}`,
  WaitTimeSeconds: 20,
});
receiveMessage.assertAtPath('Messages.0.Body.source', ExpectedResult.stringLikeRegexp('cdk-integ'));
