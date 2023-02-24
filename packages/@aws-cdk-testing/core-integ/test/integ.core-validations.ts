import * as path from 'path';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Stack, StackProps } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
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


class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new MyCustomL3Construct(this, 'MyCustomL3Construct');
  }
}

class MyCustomL3Construct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    new s3.Bucket(this, 'Bucket', {
      accessControl: s3.BucketAccessControl.PUBLIC_READ,
    });
  }
}

const stack = new MyStack(app, 'validator-test');
const stack2 = new MyStack(app, 'validator-test2');

new integ.IntegTest(app, 'integ-test', {
  testCases: [stack, stack2],
});
