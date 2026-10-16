import { exactOptionalAssignabilityDiagnosticsForPackage } from '@aws-cdk/cdk-build-tools';

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
 * The shared harness enumerates every exported, non-abstract class in this
 * package and compiles `const _: IFoo = foo` for each interface it implements
 * (its own and inherited) with the flag on. Enumerating — rather than listing
 * classes by hand — keeps the guard complete by construction: a newly-added
 * class, or a new optional getter on an existing one, is caught automatically.
 */
describe('exactOptionalPropertyTypes assignability (issue #37996)', () => {
  // Enumerating + compiling the source graph through the compiler API is heavier
  // than a normal unit test; give it room under the suite's 60s ceiling.
  test('aws-apigateway concrete classes are assignable to their interfaces under the flag', () => {
    expect(exactOptionalAssignabilityDiagnosticsForPackage(__dirname)).toEqual([]);
  }, 45_000);
});
