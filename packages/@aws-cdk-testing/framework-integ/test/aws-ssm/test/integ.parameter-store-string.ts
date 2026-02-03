import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ssm from 'aws-cdk-lib/aws-ssm';

const SECURE_PARAM_NAME = '/My/Secret/Parameter';

class CreatingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    new ssm.StringParameter(this, 'String', {
      parameterName: '/My/Public/Parameter',
      stringValue: 'Abc123',
    });

    new integ.AwsApiCall(this, 'SecureParam', {
      service: 'SSM',
      api: 'putParameter',
      parameters: {
        Name: SECURE_PARAM_NAME,
        Type: 'SecureString',
        Value: 'Abc123',
      },
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
    }).stringValue;
    const secretValueVersion = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'MySecureValueVersion', {
      parameterName: '/My/Secret/Parameter',
      version: 1,
    }).stringValue;
    const secretValueVersionFromToken = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'MySecureValueVersionFromToken', {
      parameterName: '/My/Secret/Parameter',
      // parameter version from token
      version: parameterVersion,
    }).stringValue;

    const user = new cdk.CfnResource(this, 'DummyResourceUsingStringParameters', {
      type: 'AWS::IAM::User',
      properties: {
        LoginProfile: {
          Password: cdk.Fn.join('-', [
            stringValue,
            stringValueVersionFromToken,
            secretValue,
            secretValueVersion,
            secretValueVersionFromToken,
          ]),
        },
      },
    });
    user.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}

const app = new cdk.App();

const creating = new CreatingStack(app, 'sspms-creating');

const using = new UsingStack(app, 'sspms-using');
using.addDependency(creating);

const cleanup = new cdk.Stack(app, 'sspms-cleanup');
cleanup.addDependency(using);

const integTest = new integ.IntegTest(app, 'SSMParameterStoreTest', {
  assertionStack: cleanup,
  testCases: [using],
});

integTest.assertions.awsApiCall('SSM', 'deleteParameter', {
  Name: SECURE_PARAM_NAME,
});
