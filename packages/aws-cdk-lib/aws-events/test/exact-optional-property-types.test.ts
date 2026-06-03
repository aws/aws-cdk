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
import { EventBus, IEventBus, ApiDestination, IApiDestination } from '../lib';

declare const eventBus: EventBus;
const _eventBus: IEventBus = eventBus;
void _eventBus;

declare const apiDestination: ApiDestination;
const _apiDestination: IApiDestination = apiDestination;
void _apiDestination;
`;

describe('exactOptionalPropertyTypes assignability (issue #37996)', () => {
  // Compiling the source graph through the compiler API is heavier than a normal
  // unit test; give it room under the suite's 60s ceiling.
  test('aws-events concrete classes are assignable to their interfaces under the flag', () => {
    expect(exactOptionalAssignabilityDiagnostics(__dirname, ASSIGNABILITY_SNIPPET)).toEqual([]);
  }, 30_000);
});
