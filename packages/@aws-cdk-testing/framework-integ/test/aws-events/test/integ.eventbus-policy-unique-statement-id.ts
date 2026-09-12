import * as iam from 'aws-cdk-lib/aws-iam';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EventBus } from 'aws-cdk-lib/aws-events';
import * as cxapi from 'aws-cdk-lib/cx-api';

/**
 * Reproduces aws/aws-cdk#29627: two identical stacks adding the same resource policy
 * statement to their own event bus. Without unique statement ids, the second stack
 * fails with "already exists" because CloudFormation requires the StatementId of
 * AWS::Events::EventBusPolicy to be unique across the account. Both stacks deploying
 * successfully proves the fix.
 */
class EventBusPolicyStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const eventBus = new EventBus(this, 'EventBus');
    eventBus.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'AllowAccountToPutEvents',
      effect: iam.Effect.ALLOW,
      principals: [new iam.AccountPrincipal(this.account)],
      actions: ['events:PutEvents'],
      resources: [eventBus.eventBusArn],
    }));

    // No sid: auto-generated under the feature flag
    eventBus.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.AccountPrincipal(this.account)],
      actions: ['events:PutEvents'],
      resources: [eventBus.eventBusArn],
    }));
  }
}

const app = new App({
  context: { [cxapi.EVENT_BUS_POLICY_UNIQUE_STATEMENT_ID]: true },
});
const stack1 = new EventBusPolicyStack(app, 'aws-cdk-event-bus-policy-unique-sid-1');
const stack2 = new EventBusPolicyStack(app, 'aws-cdk-event-bus-policy-unique-sid-2');

new IntegTest(app, 'EventBusPolicyUniqueSidInteg', {
  testCases: [stack1, stack2],
});
