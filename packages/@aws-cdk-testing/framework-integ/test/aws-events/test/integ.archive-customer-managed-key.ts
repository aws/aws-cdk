import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Archive, EventBus } from 'aws-cdk-lib/aws-events';

const app = new App();
const stack = new Stack(app, 'archive-customer-managed-key');

const kmsKey = new kms.Key(stack, 'KmsKey', {
  removalPolicy: RemovalPolicy.DESTROY,
  policy: new iam.PolicyDocument({
    statements: [
      new iam.PolicyStatement({
        resources: ['*'],
        actions: ['kms:*'],
        principals: [
          new iam.AccountPrincipal(stack.account),
        ],
        sid: 'Allow IAM User to modify the key',
        effect: iam.Effect.ALLOW,
      }),
    ],
  }),
});

new Archive(stack, 'Archive', {
  kmsKey: kmsKey,
  sourceEventBus: EventBus.fromEventBusName(stack, 'DefaultEventBus', 'default'),
  eventPattern: {
    source: ['test'],
  },
});

new IntegTest(app, 'archive-customer-managed-key-test', {
  testCases: [stack],
});
