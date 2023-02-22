import * as path from 'path';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { CfnguardValidationPlugin } from '../lib/plugins/cfnguard';
import { CheckovValidationPlugin } from '../lib/plugins/checkov';
// import { KicsValidationPlugin } from '../lib/plugins/kics';


const app = new App({
  validationPlugins: [
    new CheckovValidationPlugin(),
    // new KicsValidationPlugin(),
    new CfnguardValidationPlugin({ path: path.join(__dirname, 'guard') }),
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
