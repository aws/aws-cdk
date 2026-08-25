import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { App, Stack } from '../../core';
import * as cxapi from '../../cx-api';
import { EventBus } from '../lib';

const FLAG = cxapi.EVENT_BUS_POLICY_UNIQUE_STATEMENT_ID;

function policyStatement(sid?: string): iam.PolicyStatement {
  return new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    principals: [new iam.AccountPrincipal('111111111111')],
    actions: ['events:PutEvents'],
    resources: ['*'],
    ...(sid !== undefined ? { sid } : {}),
  });
}

function statementIdsOf(stack: Stack): string[] {
  const policies = Template.fromStack(stack).findResources('AWS::Events::EventBusPolicy');
  return Object.values(policies).map((p: any) => p.Properties.StatementId);
}

describe('event bus policy unique statement id', () => {
  test('suffixes the StatementId with a hash unique to the bus', () => {
    // GIVEN
    const app = new App({ context: { [FLAG]: true } });
    const stack = new Stack(app, 'Stack');
    const bus = new EventBus(stack, 'Bus');

    // WHEN
    bus.addToResourcePolicy(policyStatement('MySid'));

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Events::EventBusPolicy', {
      StatementId: Match.stringLikeRegexp('^cdk-MySid-[0-9a-f]{8}$'),
      Statement: Match.objectLike({
        Sid: Match.stringLikeRegexp('^cdk-MySid-[0-9a-f]{8}$'),
      }),
    });
  });

  test('keeps the legacy logical ID so enabling the flag does not replace the construct', () => {
    // GIVEN: same construct tree, flag off and on
    const appOff = new App();
    const stackOff = new Stack(appOff, 'Stack');
    new EventBus(stackOff, 'Bus').addToResourcePolicy(policyStatement('MySid'));

    const appOn = new App({ context: { [FLAG]: true } });
    const stackOn = new Stack(appOn, 'Stack');
    new EventBus(stackOn, 'Bus').addToResourcePolicy(policyStatement('MySid'));

    // THEN: identical logical IDs for the policy resource
    const idsOff = Object.keys(Template.fromStack(stackOff).findResources('AWS::Events::EventBusPolicy'));
    const idsOn = Object.keys(Template.fromStack(stackOn).findResources('AWS::Events::EventBusPolicy'));
    expect(idsOn).toEqual(idsOff);
  });

  test('two stacks with the same construct tree get different StatementIds', () => {
    // GIVEN: the exact collision scenario from the issue
    const app = new App({ context: { [FLAG]: true } });
    const makeStack = (id: string) => {
      const stack = new Stack(app, id);
      const bus = new EventBus(stack, 'Bus');
      bus.addToResourcePolicy(policyStatement('AllowTrustedAccountToPutEvents'));
      return stack;
    };
    const stack1 = makeStack('EventBusStack-12345');
    const stack2 = makeStack('EventBusStack-67890');

    // THEN
    const [id1] = statementIdsOf(stack1);
    const [id2] = statementIdsOf(stack2);
    expect(id1).not.toEqual(id2);
    expect(id1).toMatch(/^cdk-AllowTrustedAccountToPutEvents-[0-9a-f]{8}$/);
    expect(id2).toMatch(/^cdk-AllowTrustedAccountToPutEvents-[0-9a-f]{8}$/);
  });

  test('StatementId is stable across synthesis of the same app', () => {
    // GIVEN
    const synthesize = () => {
      const app = new App({ context: { [FLAG]: true } });
      const stack = new Stack(app, 'Stack');
      new EventBus(stack, 'Bus').addToResourcePolicy(policyStatement('MySid'));
      return statementIdsOf(stack)[0];
    };

    // THEN
    expect(synthesize()).toEqual(synthesize());
  });

  test('sid becomes optional and distinct ids are generated for multiple statements', () => {
    // GIVEN
    const app = new App({ context: { [FLAG]: true } });
    const stack = new Stack(app, 'Stack');
    const bus = new EventBus(stack, 'Bus');

    // WHEN
    const result1 = bus.addToResourcePolicy(policyStatement());
    const result2 = bus.addToResourcePolicy(policyStatement());

    // THEN
    expect(result1.statementAdded).toBe(true);
    expect(result2.statementAdded).toBe(true);
    const ids = statementIdsOf(stack);
    expect(ids).toHaveLength(2);
    expect(ids[0]).not.toEqual(ids[1]);
    expect(ids[0]).toMatch(/^cdk-Statement0-[0-9a-f]{8}$/);
    expect(ids[1]).toMatch(/^cdk-Statement1-[0-9a-f]{8}$/);
  });

  test('truncates long sids so the StatementId stays within the 64 character limit', () => {
    // GIVEN
    const app = new App({ context: { [FLAG]: true } });
    const stack = new Stack(app, 'Stack');
    const bus = new EventBus(stack, 'Bus');

    // WHEN
    bus.addToResourcePolicy(policyStatement('a'.repeat(100)));

    // THEN
    const [id] = statementIdsOf(stack);
    expect(id.length).toBeLessThanOrEqual(64);
    expect(id).toMatch(/^cdk-a+-[0-9a-f]{8}$/);
  });

  test('fails without a sid when the flag is disabled', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const bus = new EventBus(stack, 'Bus');

    // THEN: legacy behavior preserved
    expect(() => bus.addToResourcePolicy(policyStatement())).toThrow('Event Bus policy statements must have a sid');
  });

  test('uses the sid verbatim when the flag is disabled', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const bus = new EventBus(stack, 'Bus');

    // WHEN
    bus.addToResourcePolicy(policyStatement('MySid'));

    // THEN: legacy behavior preserved
    Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBusPolicy', {
      StatementId: 'cdk-MySid',
    });
  });
});
