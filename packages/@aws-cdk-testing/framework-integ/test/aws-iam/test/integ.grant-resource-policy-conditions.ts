import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';

class GrantConditionsStack extends Stack {
  public readonly conditions: Record<string, Record<string, unknown>>;
  public readonly servicePrincipalQueue: sqs.Queue;
  public readonly principalAndResourceQueue: sqs.Queue;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.conditions = {
      StringEquals: { 'aws:SourceAccount': this.account },
      ArnLike: {
        'aws:SourceArn': this.formatArn({ service: 's3', region: '', account: '', resource: 'trusted-source-bucket' }),
      },
    };

    // A service principal cannot take an identity policy, so the grant falls back to the resource policy
    this.servicePrincipalQueue = new sqs.Queue(this, 'ServicePrincipalQueue', {
      encryption: sqs.QueueEncryption.SQS_MANAGED,
    });
    iam.Grant.addToPrincipalOrResource({
      grantee: new iam.ServicePrincipal('s3.amazonaws.com'),
      actions: ['sqs:SendMessage'],
      resourceArns: [this.servicePrincipalQueue.queueArn],
      resource: this.servicePrincipalQueue,
      conditions: this.conditions,
    });

    this.principalAndResourceQueue = new sqs.Queue(this, 'PrincipalAndResourceQueue', {
      encryption: sqs.QueueEncryption.SQS_MANAGED,
    });
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    iam.Grant.addToPrincipalAndResource({
      grantee: role,
      actions: ['sqs:SendMessage'],
      resourceArns: [this.principalAndResourceQueue.queueArn],
      resource: this.principalAndResourceQueue,
      conditions: this.conditions,
    });
  }
}

const app = new App();
const stack = new GrantConditionsStack(app, 'aws-cdk-iam-grant-resource-policy-conditions');

const integ = new IntegTest(app, 'GrantResourcePolicyConditionsTest', {
  testCases: [stack],
});

for (const queue of [stack.servicePrincipalQueue, stack.principalAndResourceQueue]) {
  integ.assertions.awsApiCall('SQS', 'getQueueAttributes', {
    QueueUrl: queue.queueUrl,
    AttributeNames: ['Policy'],
  }).expect(ExpectedResult.objectLike({
    Attributes: {
      Policy: Match.serializedJson(Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'sqs:SendMessage',
            Condition: stack.conditions,
          }),
        ]),
      })),
    },
  }));
}
