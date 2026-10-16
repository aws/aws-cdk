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
import { GatewayTarget, IMcpGatewayTarget } from '../lib';

declare const gatewayTarget: GatewayTarget;
const _gatewayTarget: IMcpGatewayTarget = gatewayTarget;
void _gatewayTarget;
`;

describe('exactOptionalPropertyTypes assignability (issue #37996)', () => {
  // Compiling the source graph through the compiler API is heavier than a normal
  // unit test; give it room under the suite's 60s ceiling.
  test('aws-bedrockagentcore concrete classes are assignable to their interfaces under the flag', () => {
    expect(exactOptionalAssignabilityDiagnostics(__dirname, ASSIGNABILITY_SNIPPET)).toEqual([]);
  }, 30_000);
});
