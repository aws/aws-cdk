import { exactOptionalAssignabilityDiagnostics } from '@aws-cdk/cdk-build-tools';

/**
 * Regression guard for https://github.com/aws/aws-cdk/issues/37996.
 *
 * Consumers who enable TypeScript's `exactOptionalPropertyTypes` can't pass a
 * concrete construct where its interface is expected, and type-checking
 * `aws-cdk-lib` fails for them outright — because a class member typed
 * `T | undefined` is not assignable to an interface's optional `?: T`. The
 * library doesn't build with the flag, so these breaks slip past its own compile
 * and only surface downstream.
 *
 * The shared harness compiles this snippet with the flag on; the assertion is
 * that this package's concrete classes stay assignable to their interfaces.
 */

// One type-only assignment per concrete class -> interface pair to lock in.
// `declare const` avoids constructor boilerplate; the assignment is the assertion.
const ASSIGNABILITY_SNIPPET = `
import {
  Cluster, ICluster,
  TaskDefinition, ITaskDefinition,
  Ec2TaskDefinition, IEc2TaskDefinition,
  ExternalTaskDefinition, IExternalTaskDefinition,
  FargateTaskDefinition, IFargateTaskDefinition,
} from '../lib';

declare const cluster: Cluster;
const _cluster: ICluster = cluster;
void _cluster;

declare const taskDefinition: TaskDefinition;
const _taskDefinition: ITaskDefinition = taskDefinition;
void _taskDefinition;

declare const ec2TaskDefinition: Ec2TaskDefinition;
const _ec2TaskDefinition: IEc2TaskDefinition = ec2TaskDefinition;
void _ec2TaskDefinition;

declare const externalTaskDefinition: ExternalTaskDefinition;
const _externalTaskDefinition: IExternalTaskDefinition = externalTaskDefinition;
void _externalTaskDefinition;

declare const fargateTaskDefinition: FargateTaskDefinition;
const _fargateTaskDefinition: IFargateTaskDefinition = fargateTaskDefinition;
void _fargateTaskDefinition;
`;

describe('exactOptionalPropertyTypes assignability (issue #37996)', () => {
  test('aws-ecs concrete classes are assignable to their interfaces under the flag', () => {
    expect(exactOptionalAssignabilityDiagnostics(__dirname, ASSIGNABILITY_SNIPPET)).toEqual([]);
  }, 30_000);
});
