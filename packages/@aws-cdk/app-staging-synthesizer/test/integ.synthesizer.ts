import * as path from 'path';
// import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { AppStagingSynthesizer, BootstrapRole } from '../lib';

const app = new App();

const stack = new Stack(app, 'app-scoped-staging-test', {
  synthesizer: AppStagingSynthesizer.stackPerEnv({
    appId: 'zabef',
    qualifier: 'hnb659fds',
    bootstrapRoles: {
      cloudFormationExecutionRole: BootstrapRole.fromRoleArn('arn:aws:iam::489318732371:role/cdk-hnb659fds-cfn-exec-role-489318732371-us-east-2'),
      lookupRole: BootstrapRole.fromRoleArn('arn:aws:iam::489318732371:role/cdk-hnb659fds-lookup-role-489318732371-us-east-2'),
      deploymentActionRole: BootstrapRole.fromRoleArn('arn:aws:iam::489318732371:role/cdk-hnb659fds-deploy-role-489318732371-us-east-2'),
    },
  }),
  env: {
    account: '489318732371',
    region: 'us-east-2',
  },
});

new lambda.Function(stack, 'lambda', {
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'assets')),
  handler: 'index.handler',
  runtime: lambda.Runtime.PYTHON_3_9,
});

// new integ.IntegTest(app, 'integ-tests', {
//   testCases: [stack],
// });

app.synth();
