import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ssm from 'aws-cdk-lib/aws-ssm';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'SSM-Parameter');

const role = new iam.Role(stack, 'UserRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const param = new ssm.StringParameter(stack, 'StringParameter', {
  stringValue: 'Initial parameter value',
});

param.grantRead(role);

const listParameter = new ssm.StringListParameter(stack, 'StringListParameter', {
  stringListValue: ['Initial parameter value A', 'Initial parameter value B'],
});

new cdk.CfnOutput(stack, 'StringListOutput', {
  value: cdk.Fn.join('+', listParameter.stringListValue),
});

new cdk.CfnOutput(stack, 'ParamArn', {
  value: param.parameterArn,
});

new IntegTest(app, 'cdk-integ-ssm-parameter', {
  testCases: [stack],
});
