import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ssm from 'aws-cdk-lib/aws-ssm';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Import-SSM-Parameter');

const parameterName = 'import-parameter-test';

const param = new ssm.StringParameter(stack, 'StringParameter', {
  stringValue: 'Initial parameter value',
  parameterName,
});

// This will use a CfnParameter.
// We have to use an existing parameter to reference it with a concrete name, so using a parameter managed by EC2.
const importedWithName = ssm.StringParameter.fromStringParameterAttributes(stack, 'ImportedWithName', {
  parameterName: '/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-ebs',
});

// This will use a dynamic reference (deduced).
const importedWithIntrinsic = ssm.StringParameter.fromStringParameterAttributes(stack, 'ImportedWithIntrinsic', {
  simpleName: true,
  parameterName: cdk.Fn.ref((param.node.defaultChild as cdk.CfnResource).logicalId),
});

// This will use a dynamic reference (forced).
const importedWithForceFlag = ssm.StringParameter.fromStringParameterAttributes(stack, 'ImportedWithForceFlag', {
  simpleName: true,
  parameterName: param.parameterName,
  forceDynamicReference: true,
});

new cdk.CfnOutput(stack, 'ImportedWithNameOutput', {
  value: importedWithName.stringValue,
});

new cdk.CfnOutput(stack, 'ImportedWithIntrinsicOutput', {
  value: importedWithIntrinsic.stringValue,
});

new cdk.CfnOutput(stack, 'ImportedWithForceFlagOutput', {
  value: importedWithForceFlag.stringValue,
});

new IntegTest(app, 'cdk-integ-import-ssm-parameter', {
  testCases: [stack],
});
