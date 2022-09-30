/// !cdk-integ *
import * as cdk from '@aws-cdk/core';
import * as ssm from '../lib';

class CreatingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    new ssm.StringParameter(this, 'String', {
      parameterName: '/My/Public/Parameter',
      stringValue: 'abcdef',
    });
  }
}

class UsingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // Parameter that contains version number, will be used to pass
    // version value from token.
    const parameterVersion = new cdk.CfnParameter(this, 'MyParameterVersion', {
      type: 'Number',
      default: 1,
    }).valueAsNumber;

    /// !show
    // Retrieve the latest value of the non-secret parameter
    // with name "/My/String/Parameter".
    const stringValue = ssm.StringParameter.fromStringParameterAttributes(this, 'MyValue', {
      parameterName: '/My/Public/Parameter',
      // 'version' can be specified but is optional.
    }).stringValue;
    const stringValueVersionFromToken = ssm.StringParameter.fromStringParameterAttributes(this, 'MyValueVersionFromToken', {
      parameterName: '/My/Public/Parameter',
      // parameter version from token
      version: parameterVersion,
    }).stringValue;

    // Retrieve a specific version of the secret (SecureString) parameter.
    const secretValue = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'MySecureValue', {
      parameterName: '/My/Secret/Parameter',
    });
    const secretValueVersion = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'MySecureValueVersion', {
      parameterName: '/My/Secret/Parameter',
      version: 5,
    });
    const secretValueVersionFromToken = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'MySecureValueVersionFromToken', {
      parameterName: '/My/Secret/Parameter',
      // parameter version from token
      version: parameterVersion,
    });

    /// !hide

    new cdk.CfnResource(this, 'Dummy', { type: 'AWS::SNS::Topic' });
    new cdk.CfnOutput(this, 'TheValue', { value: stringValue });
    new cdk.CfnOutput(this, 'TheValueVersionFromToken', { value: stringValueVersionFromToken });

    // Cannot be provisioned so cannot be actually used
    Array.isArray(secretValue);
    Array.isArray(secretValueVersion);
    Array.isArray(secretValueVersionFromToken);
  }
}

const app = new cdk.App();

const creating = new CreatingStack(app, 'sspms-creating');
const using = new UsingStack(app, 'sspms-using');
using.addDependency(creating);

app.synth();
