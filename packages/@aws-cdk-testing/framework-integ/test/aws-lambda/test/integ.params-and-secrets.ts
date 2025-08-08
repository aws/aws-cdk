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
  ParamsAndSecretsLogLevel,
} from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

interface StackUnderTestProps extends StackProps {
  architecture: Architecture;
}

class StackUnderTest extends Stack {
  constructor(scope: Construct, id: string, props: StackUnderTestProps) {
    super(scope, id, props);

    const parameter = new StringParameter(this, 'Parameter', {
      parameterName: `email_url_${id}`,
      stringValue: 'api.example.com',
    });
    const secret = new Secret(this, 'MySecret');

    const paramsAndSecrets = ParamsAndSecretsLayerVersion.fromVersion(ParamsAndSecretsVersions.V1_0_103, {
      cacheSize: 100,
      cacheEnabled: true,
      httpPort: 8080,
      logLevel: ParamsAndSecretsLogLevel.DEBUG,
      maxConnections: 5,
      secretsManagerTtl: cdk.Duration.seconds(100),
      parameterStoreTtl: cdk.Duration.seconds(100),
    });

    const lambdaFunction = new Function(this, 'MyFunc', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, 'params-and-secrets-handler')),
      architecture: props.architecture,
      paramsAndSecrets,
    });

    secret.grantRead(lambdaFunction);
    parameter.grantRead(lambdaFunction);
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

app.synth();
