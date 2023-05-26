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
// We have to use an existing parameter to reference it with a concrete name, hence using a parameter managed by EC2.
const importedWithName = ssm.StringParameter.fromStringParameterAttributes(stack, 'ImportedWithName', {
  parameterName: '/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-ebs',
});

// This will use a dynamic reference.
const importedWithToken = ssm.StringParameter.fromStringParameterAttributes(stack, 'ImportedWithToken', {
  simpleName: true,
  parameterName: param.parameterName,
});

new cdk.CfnOutput(stack, 'ImportedWithNameOutput', {
  value: importedWithName.stringValue,
});

new cdk.CfnOutput(stack, 'ImportedWithTokenOutput', {
  value: importedWithToken.stringValue,
});

new IntegTest(app, 'cdk-integ-import-ssm-parameter', {
  testCases: [stack],
});
