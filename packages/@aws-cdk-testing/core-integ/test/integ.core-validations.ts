import * as s3 from '@aws-cdk/aws-s3';
import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { CheckovValidationPlugin } from '../lib/plugins/checkov';


const app = new App({
  validationPlugins: [
    new CheckovValidationPlugin(),
  ],
  postCliContext: {
    pathMetadata: true,
  },
});

const stack = new Stack(app, 'validator-test');


new s3.Bucket(stack, 'Bucket', {
  accessControl: s3.BucketAccessControl.PUBLIC_READ,
});

new integ.IntegTest(app, 'integ-test', {
  testCases: [stack],
});
