import { App, Stack } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class KmsKeyMultiRegionStack extends Stack {
  constructor(scope: App) {
    super(scope, 'KmsKeyMultiRegionStack');
    new kms.Key(this, 'key', {
      multiRegion: true,
    });
  }
}

const app = new App({ context: { '@aws-cdk/core:disableGitSource': true } });
const stack = new KmsKeyMultiRegionStack(app);

new IntegTest(app, 'kms-key-multi-region', {
  testCases: [stack],
});
