import * as feats from '../lib/features';

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