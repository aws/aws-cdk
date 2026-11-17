import { App, Stack, CfnOutput } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'events-eventbus-policy-stack');

const bus = events.EventBus.fromEventBusName(stack, 'Default', 'default');

new events.EventBusPolicy(stack, 'MyPolicy', {
  eventBus: bus,
  statementId: 'AllowPutEventsFromAccount',
  statement: new iam.PolicyStatement({
    principals: [new iam.AccountPrincipal(app.account)],
    actions: ['events:PutEvents'],
    resources: [bus.eventBusArn],
  }),
});

new CfnOutput(stack, 'PolicyStatementId', {
  value: 'AllowPutEventsFromAccount',
});

new IntegTest(app, 'events-eventbus-policy-integ', {
  testCases: [stack],
});

app.synth();
