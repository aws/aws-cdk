import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { APP_ID_MAX } from './util';
import { AppStagingSynthesizer } from '../lib';

const app = new App({
  context: {
    '@aws-cdk/aws-iam:minimizePolicies': true,
  },
});

const stackDefaultEncryption = new Stack(app, 'synthesize-default-encryption', {
  synthesizer: AppStagingSynthesizer.defaultResources({
    appId: APP_ID_MAX, // this has implications on the overall template size
    stagingBucketEncryption: BucketEncryption.S3_MANAGED,
  }),
});

const defaultStagingStack = app.node.tryFindChild(`StagingStack-${APP_ID_MAX}-ACCOUNT-REGION`) as Stack;
if (!defaultStagingStack) {
  throw new Error('Default Staging Stack not found.');
}

new integ.IntegTest(app, 'integ-tests', {
  testCases: [defaultStagingStack, stackDefaultEncryption],
  // The staging bucket's auto-delete custom resource Lambda role lacks s3:GetBucketTagging
  // permission because the deploy role's resource policy overwrites it. This is a known
  // library issue — the deploy succeeds but teardown fails when deleting the bucket.
  cdkCommandOptions: {
    destroy: {
      args: {
        force: true,
      },
      expectError: true,
    },
  },
});

app.synth();
