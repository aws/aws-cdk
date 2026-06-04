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
import { Secret, ISecret, SecretTargetAttachment, ISecretTargetAttachment } from '../lib';

declare const secret: Secret;
const _secret: ISecret = secret;
void _secret;

declare const attachment: SecretTargetAttachment;
const _attachment: ISecretTargetAttachment = attachment;
void _attachment;
`;

describe('exactOptionalPropertyTypes assignability (issue #37996)', () => {
  test('aws-secretsmanager concrete classes are assignable to their interfaces under the flag', () => {
    expect(exactOptionalAssignabilityDiagnostics(__dirname, ASSIGNABILITY_SNIPPET)).toEqual([]);
  }, 30_000);
});
