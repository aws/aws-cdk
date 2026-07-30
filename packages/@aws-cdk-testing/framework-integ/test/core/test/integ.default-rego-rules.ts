import * as cdk from 'aws-cdk-lib';
import * as gamelift from 'aws-cdk-lib/aws-gamelift';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Exercises the CDK-authored default Rego rules that ship with the
 * CloudFormationValidatePlugin (core/lib/validation/rules/).
 *
 * The stack contains a compliant TERMINAL-routing GameLift alias (deployable
 * without a fleet, no cost) and a violating alias that both routes to a fleet
 * and carries a terminal message (CDK-GameLift-005). The violating alias sits
 * behind a never-true condition: the default Rego rules evaluate the full
 * template regardless of conditions, so the finding is still reported at
 * synth, but CloudFormation never creates the invalid resource — which the
 * GameLift API would reject.
 *
 * With the default warning posture the violation does not block deployment;
 * the snapshot captures the violating template so a regression in default
 * rule loading or evaluation shows up as a snapshot diff.
 */
const app = new cdk.App();

const stack = new cdk.Stack(app, 'DefaultRegoRulesStack');

new gamelift.CfnAlias(stack, 'CompliantAlias', {
  name: 'default-rego-rules-compliant',
  routingStrategy: { type: 'TERMINAL', message: 'server offline for maintenance' },
});

const neverTrue = new cdk.CfnCondition(stack, 'NeverTrue', {
  expression: cdk.Fn.conditionEquals('true', 'false'),
});

const violating = new gamelift.CfnAlias(stack, 'ViolatingAlias', {
  name: 'default-rego-rules-violating',
  routingStrategy: { type: 'TERMINAL', message: 'goodbye' },
});
violating.cfnOptions.condition = neverTrue;
// Inject the contradictory FleetId via escape hatch — the L2/L1 props would
// not produce this shape, which is exactly the gap the default rule covers.
violating.addPropertyOverride('RoutingStrategy.FleetId', 'fleet-11111111-2222-3333-4444-555555555555');

new IntegTest(app, 'DefaultRegoRulesTest', {
  testCases: [stack],
});
