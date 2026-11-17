import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();

const account = process.env.CDK_INTEG_ACCOUNT || '123456789012';
const region = process.env.CDK_INTEG_REGION || 'us-east-1';

const stack = new Stack(app, 'events-eventbus-policy-stack', {
  env: { account, region },
});

const bus = events.EventBus.fromEventBusName(stack, 'Default', 'default');

new events.EventBusPolicy(stack, 'MyPolicy', {
  eventBus: bus,
  statementId: 'AllowPutEventsFromAccount',
  statement: new iam.PolicyStatement({
    principals: [new iam.AccountPrincipal(account)],
    actions: ['events:PutEvents'],
    resources: [bus.eventBusArn],
  }),
});

new IntegTest(app, 'events-eventbus-policy-integ', {
  testCases: [stack],
});

app.synth();
