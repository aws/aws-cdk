import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { StackProps, Stack } from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import {
  Architecture,
  Function,
  Runtime,
  Code,
  ParamsAndSecretsLayerVersion,
  ParamsAndSecretsVersions,
} from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App();

interface StackUnderTestProps extends StackProps {
  architecture: Architecture,
}

class StackUnderTest extends Stack {
  constructor(scope: Construct, id: string, props: StackUnderTestProps) {
    super(scope, id, props);

    const parameter = new StringParameter(this, 'Parameter', {
      parameterName: 'email_url',
      stringValue: 'api.example.com',
    });
    const secret = new Secret(this, 'MySecret');

    new Function(this, 'MyFunc', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, 'params-and-secrets-handler', 'index.py')),
      architecture: props.architecture,
      paramsAndSecrets: {
        layerVersion: ParamsAndSecretsLayerVersion.fromVersion(ParamsAndSecretsVersions.V4, {

        }),
        secrets: [secret],
        parameters: [parameter],
      },
    });
  }
}

new IntegTest(app, 'IntegTest', {
  testCases: [
    new StackUnderTest(app, 'Stack1', {
      architecture: Architecture.X86_64,
    }),
    new StackUnderTest(app, 'Stack2', {
      architecture: Architecture.ARM_64,
    }),
  ],
});
