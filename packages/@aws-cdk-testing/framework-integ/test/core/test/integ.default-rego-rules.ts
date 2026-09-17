import * as cdk from 'aws-cdk-lib';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as gamelift from 'aws-cdk-lib/aws-gamelift';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Exercises the CDK-authored default Rego rules that ship with the
 * CloudFormationValidatePlugin (core/lib/validation/rules/).
 *
 * The stack contains a compliant TERMINAL-routing GameLift alias (deployable
 * without a fleet, no cost) and a violating alias that both routes to a fleet
 * and carries a terminal message (CDK-GameLift-005) — contradictory
 * configuration that GameLift accepts but partially ignores. The violating
 * alias sits behind a never-true condition: the default Rego rules evaluate
 * the full template regardless of conditions, so the finding is still
 * reported at synth, while CloudFormation never creates the resource.
 *
 * The ElastiCache half of the stack sits behind that same condition in full:
 * a replication group is billed for as long as it exists and takes minutes to
 * create, and the rules it trips (CDK-ElastiCache-001 for cluster mode,
 * CDK-ElastiCache-002 for user group access control) are decided entirely
 * from the template, so creating one for real buys no extra signal.
 *
 * With the default warning posture the violations do not block deployment;
 * the snapshot captures the violating template and the validation report, so
 * a regression in default rule loading or evaluation shows up as a snapshot
 * diff.
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

// Cluster mode lives in the parameter group, so this one is only decidable by
// following the replication group's Ref to the group it names.
const parameterGroup = new elasticache.CfnParameterGroup(stack, 'ParameterGroup', {
  cacheParameterGroupFamily: 'redis7',
  description: 'default rego rules',
  properties: { 'maxmemory-policy': 'allkeys-lru' },
});
parameterGroup.cfnOptions.condition = neverTrue;

const violatingReplicationGroup = new elasticache.CfnReplicationGroup(stack, 'ViolatingReplicationGroup', {
  replicationGroupDescription: 'default rego rules',
  engine: 'redis',
  cacheNodeType: 'cache.t4g.micro',
  // Two node groups against a parameter group that leaves cluster mode off
  // (CDK-ElastiCache-001), and user group access control without encryption
  // in transit (CDK-ElastiCache-002).
  numNodeGroups: 2,
  cacheParameterGroupName: parameterGroup.ref,
  userGroupIds: ['default-rego-rules'],
});
violatingReplicationGroup.cfnOptions.condition = neverTrue;

new IntegTest(app, 'DefaultRegoRulesTest', {
  testCases: [stack],
});
