import { App, Stack } from 'aws-cdk-lib';
import { Alias } from 'aws-cdk-lib/aws-kms';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { ServicePrincipal, Role } from 'aws-cdk-lib/aws-iam';
import * as cxapi from 'aws-cdk-lib/cx-api';

const app = new App({
  context: { [cxapi.KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL]: true },
});
const stack = new Stack(app, 'aws-cdk-kms');
const alias = Alias.fromAliasName(stack, 'alias', 'alias/MyKey');

const role = new Role(stack, 'Role', {
  assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
});

alias.grantVerifyMac(role);
alias.grantEncryptDecrypt(role);
alias.grantSignVerify(role);
alias.grantGenerateMac(role);

new IntegTest(app, 'kms-alias-from-alias-name', {
  testCases: [stack],
});

app.synth();
