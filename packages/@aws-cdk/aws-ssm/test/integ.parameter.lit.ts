import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import ssm = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'SSM-Parameter');

const role = new iam.Role(stack, 'UserRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

/// !show
// Create a new SSM Parameter holding a String
const param = new ssm.StringParameter(stack, 'StringParameter', {
  // description: 'Some user-friendly description',
  // name: 'ParameterName',
  stringValue: 'Initial parameter value',
  // allowedPattern: '.*',
});

// Grant read access to some Role
param.grantRead(role);

// Create a new SSM Parameter holding a StringList
const listParameter = new ssm.StringListParameter(stack, 'StringListParameter', {
  // description: 'Some user-friendly description',
  // name: 'ParameterName',
  stringListValue: ['Initial parameter value A', 'Initial parameter value B'],
  // allowedPattern: '.*',
});
/// !hide

new cdk.CfnOutput(stack, 'StringListOutput', {
  value: cdk.Fn.join('+', listParameter.stringListValue),
});

new cdk.CfnOutput(stack, 'ParamArn', {
  value: param.parameterArn
});

app.synth();
