import { App, Stack } from 'aws-cdk-lib';
import { Alias } from 'aws-cdk-lib/aws-kms';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'aws-cdk-kms');
const alias = Alias.fromAliasName(stack, 'alias', 'alias/MyKey');

const role = new Role(stack, 'Role', {
  assumedBy: new AccountRootPrincipal(),
});

alias.grantVerifyMac(role);
alias.grantEncryptDecrypt(role);
alias.grantSignVerify(role);
alias.grantGenerateMac(role);

new IntegTest(app, 'kms-alias-from-alias-name', {
  testCases: [stack],
});

app.synth();
