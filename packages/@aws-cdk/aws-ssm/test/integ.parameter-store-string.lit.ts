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

    /// !show
    // Retrieve the latest value of the non-secret parameter
    // with name "/My/String/Parameter".
    const stringValue = ssm.StringParameter.fromStringParameterAttributes(this, 'MyValue', {
      parameterName: '/My/Public/Parameter',
      // 'version' can be specified but is optional.
    }).stringValue;

    // Retrieve a specific version of the secret (SecureString) parameter.
    // 'version' is always required.
    const secretValue = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'MySecureValue', {
      parameterName: '/My/Secret/Parameter',
      version: 5,
    });
    /// !hide

    new cdk.CfnResource(this, 'Dummy', { type: 'AWS::SNS::Topic' });
    new cdk.CfnOutput(this, 'TheValue', { value: stringValue });

    // Cannot be provisioned so cannot be actually used
    Array.isArray(secretValue);
  }
}

const app = new cdk.App();

const creating = new CreatingStack(app, 'sspms-creating');
const using = new UsingStack(app, 'sspms-using');
using.addDependency(creating);

app.synth();
