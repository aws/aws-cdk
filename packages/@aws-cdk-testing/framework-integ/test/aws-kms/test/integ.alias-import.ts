import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';

const app = new App();
const stack = new Stack(app, 'KmsAliasImportStack');

const key = new kms.Key(stack, 'Key', {
  removalPolicy: RemovalPolicy.DESTROY,
});

new kms.Alias(stack, 'Alias', {
  aliasName: 'alias/integ-test-alias',
  targetKey: key,
  removalPolicy: RemovalPolicy.DESTROY,
});

// Import alias without prefix - should auto-add 'alias/'
const imported = kms.Alias.fromAliasName(stack, 'ImportedAlias', 'integ-test-alias');
new kms.Alias(stack, 'AliasRef', {
  aliasName: 'alias/integ-test-alias-ref',
  targetKey: imported,
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'KmsAliasImportInteg', {
  testCases: [stack],
});
