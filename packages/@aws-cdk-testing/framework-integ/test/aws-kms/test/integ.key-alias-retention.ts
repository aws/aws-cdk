import { App, Stack } from 'aws-cdk-lib';
import { Key } from 'aws-cdk-lib/aws-kms';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

// Fixed (non-tokenized) name so the postDestroy cleanup hook can target the
// alias by name. KMS alias names are unique per account/region, so the alias
// must be deleted after the stack is destroyed to avoid collisions on rerun.
const aliasName = 'alias/cdk-integ-kms-key-retention';

const app = new App();
const stack = new Stack(app, 'KeyAliasRetentionStack');

// The key uses the default RemovalPolicy.RETAIN. The alias inherits the key's
// removal policy, so both are retained when the stack is destroyed.
new Key(stack, 'Key', {
  alias: aliasName,
});

const integ = new IntegTest(app, 'kms-key-alias-retention', {
  testCases: [stack],
  // The committed snapshot does not contain the retained key/alias that a
  // previous run leaves behind, so the upgrade workflow would conflict.
  stackUpdateWorkflow: false,
  // The key is retained intentionally and expires on its own; the alias name is
  // unique per account/region, so it is deleted after the stack is destroyed to
  // prevent collisions when the test is re-run.
  hooks: {
    postDestroy: [`aws kms delete-alias --alias-name ${aliasName}`],
  },
});

// Confirm post-deploy that the alias exists and points at an enabled key.
integ.assertions.awsApiCall('KMS', 'describeKey', { KeyId: aliasName })
  .expect(ExpectedResult.objectLike({ KeyMetadata: { Enabled: true } }));

app.synth();
