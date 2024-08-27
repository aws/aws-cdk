import * as fs from 'fs';
import * as path from 'path';
import * as feats from '../lib/features';
import { MAGIC_V2NEXT, compareVersions } from '../lib/private/flag-modeling';

test('all future flags have defaults configured', () => {
  Object.keys(feats.FLAGS).forEach(flag => {
    expect(typeof(feats.futureFlagDefault(flag))).toEqual('boolean');
  });
});

test('futureFlagDefault returns false if non existent flag was given', () => {
  expect(feats.futureFlagDefault('non-existent-flag')).toEqual(false);
});

test('feature flag defaults may not be changed anymore', () => {
  // In principle, these flags were decided upon during the v2 alpha period, and they are now frozen
  // and may not be changed anymore.
  //
  // One exception is allowed: to avoid a double negative in your flag name (`disableOldBehavior: true`).
  //
  // In that case, it is permitted to name the flag `oldBehavior`, add a new default set to `true`,
  // and have the recommended value be `false`.
  expect(feats.CURRENT_VERSION_FLAG_DEFAULTS).toEqual({
    // V1->V2 defaults below here
    [feats.APIGATEWAY_USAGEPLANKEY_ORDERINSENSITIVE_ID]: true,
    [feats.ENABLE_STACK_NAME_DUPLICATES_CONTEXT]: true,
    [feats.ENABLE_DIFF_NO_FAIL_CONTEXT]: true,
    [feats.STACK_RELATIVE_EXPORTS_CONTEXT]: true,
    [feats.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: true,
    [feats.DOCKER_IGNORE_SUPPORT]: true,
    [feats.SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME]: true,
    [feats.KMS_DEFAULT_KEY_POLICIES]: true,
    [feats.S3_GRANT_WRITE_WITHOUT_ACL]: true,
    [feats.ECS_REMOVE_DEFAULT_DESIRED_COUNT]: true,
    [feats.RDS_LOWERCASE_DB_IDENTIFIER]: true,
    [feats.EFS_DEFAULT_ENCRYPTION_AT_REST]: true,
    [feats.LAMBDA_RECOGNIZE_VERSION_PROPS]: true,
    [feats.CLOUDFRONT_DEFAULT_SECURITY_POLICY_TLS_V1_2_2021]: true,
    [feats.PIPELINE_REDUCE_ASSET_ROLE_TRUST_SCOPE]: true,
    // Add new disabling feature flags below this line
  });
});

test('expired feature flags may not be changed anymore', () => {
  expect(feats.CURRENT_VERSION_EXPIRED_FLAGS).toEqual([
    feats.DOCKER_IGNORE_SUPPORT,
    feats.ECS_REMOVE_DEFAULT_DESIRED_COUNT,
    feats.EFS_DEFAULT_ENCRYPTION_AT_REST,
    feats.ENABLE_DIFF_NO_FAIL_CONTEXT,
    feats.ENABLE_STACK_NAME_DUPLICATES_CONTEXT,
    feats.KMS_DEFAULT_KEY_POLICIES,
    feats.S3_GRANT_WRITE_WITHOUT_ACL,
    feats.SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME,
  ].sort());
});

test.each([
  ['1.2.3', '1.2.3', 0],
  ['1.2.3', '1.2.4', -1],
  ['1.2.3', '2.0.0', -1],
  ['100.2.3', '2.0.0', 1],
  ['V2NEXT', 'V2NEXT', 0],
  ['1.0.0', 'V2NEXT', -1],
  ['2.100.0', 'V2NEXT', -1],
  ['3.100.0', 'V2NEXT', 1],
])('compareVersions(%p, %p) -> %p (and the reverse)', (a, b, expected) => {
  expect(compareVersions(a, b)).toEqual(expected);
  expect(compareVersions(b, a)).toBeCloseTo(-expected, 10); // Gets around expect(-0).toEqual(0) failing... :x
});

// eslint-disable-next-line @aws-cdk/no-invalid-path
const currentv2: string = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'version.v2.json'), { encoding: 'utf-8' })).version;

describe(`introducedIn.v2 is either <= ${currentv2} or magic value "${MAGIC_V2NEXT}"`, () => {
  test.each(Object.keys(feats.FLAGS))('for flag %p', flag => {
    const v2In = feats.FLAGS[flag].introducedIn.v2;
    if (v2In === undefined || v2In === MAGIC_V2NEXT) {
      return;
    }

    // If defined and not magic, it must be in the past w.r.t. the current v2 version
    expect(compareVersions(v2In, currentv2)).not.toEqual(1);
  });
});

test('features.ts should not contain a reference to the constant with the magic value', () => {
  // If it did, the above test would succeed but we would not be able to substitute the string at bump time
  const featuresSourceFile = path.join(__dirname, '..', 'lib', 'features.ts');
  expect(fs.readFileSync(featuresSourceFile, { encoding: 'utf-8' })).not.toContain('MAGIC_V2NEXT');
});