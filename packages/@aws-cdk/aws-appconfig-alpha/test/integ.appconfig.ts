import { Stack, App, Duration, RemovalPolicy, Fn, SecretValue } from 'aws-cdk-lib';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { S3DeployAction, S3SourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { CfnDocument, StringParameter } from 'aws-cdk-lib/aws-ssm';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import {
  Application,
  DeploymentStrategy,
  HostedConfiguration,
  ConfigurationSource,
  SourcedConfiguration,
  JsonSchemaValidator,
  LambdaValidator,
  ConfigurationContent,
  RolloutStrategy,
} from '../lib';

const SCHEMA_STR =
`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "string"
}`;

const LAMBDA_CODE =
`
def handler(event, context):
  print('This is my dummy validator')
`;

class AppConfigTestStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    new Application(this, 'MyAppConfig', {
      description: 'This is my application for testing',
    });

    const taskDef = new FargateTaskDefinition(this, 'MyTaskDef');
    Application.addAgentToEcs(taskDef);

    // create application for config profile
    const app = new Application(this, 'MyAppConfigForConfig', {
      name: 'AppForConfigTest',
    });

    const deploymentStrategy = new DeploymentStrategy(this, 'MyDeployStrategy', {
      rolloutStrategy: RolloutStrategy.linear(100, Duration.minutes(0)),
    });

    // create basic config profile and add config version
    const hostedEnv = app.addEnvironment('HostedEnv');
    new HostedConfiguration(this, 'MyHostedConfig', {
      application: app,
      content: ConfigurationContent.fromInline('This is my configuration content.'),
      deployTo: [hostedEnv],
      validators: [
        JsonSchemaValidator.fromInline(SCHEMA_STR),
        // JsonSchemaValidator.fromAsset('/Users/chenjane/Documents/appconfig-l2-constructs/test/schema.json'),
      ],
      deploymentStrategy,
    });

    // create basic config profile from add config version from file
    const hostedEnvFromJson = app.addEnvironment('HostedEnvFromJson');
    new HostedConfiguration(this, 'MyHostedConfigFromJson', {
      application: app,
      content: ConfigurationContent.fromInline('This is the configuration content'),
      deployTo: [hostedEnvFromJson],
      deploymentStrategy,
    });

    // ssm paramter as configuration source
    const func = new Function(this, 'MyValidatorFunction', {
      runtime: Runtime.PYTHON_3_8,
      handler: 'index.handler',
      code: Code.fromInline(LAMBDA_CODE),
    });
    const parameterEnv = app.addEnvironment('ParameterEnv');
    const ssmParameter = new StringParameter(this, 'MyParameter', {
      stringValue: 'This is the content stored in ssm parameter',
    });
    new SourcedConfiguration(this, 'MyConfigFromParameter', {
      name: 'TestConfigProfileStoredAsParamater',
      application: app,
      description: 'This is a configuration profile used for integ testing',
      location: ConfigurationSource.fromParameter(ssmParameter),
      versionNumber: '1',
      deployTo: [parameterEnv],
      validators: [
        LambdaValidator.fromFunction(func),
      ],
      deploymentStrategy,
    });

    // ssm document as configuration source
    const documentEnv = app.addEnvironment('DocumentEnv');
    const ssmDocument = new CfnDocument(this, 'MyDocument', {
      content: {
        schemaVersion: '2.2',
        description: 'Sample SSM Document',
        mainSteps: [
          {
            action: 'aws:runShellScript',
            name: 'step1',
            inputs: {
              runCommand: [
                'echo "Hello, World!"',
              ],
            },
          },
        ],
      },
      documentType: 'Command',
      name: 'TestDocument',
    });
    new SourcedConfiguration(this, 'MyConfigFromDocument', {
      application: app,
      location: ConfigurationSource.fromDocument(ssmDocument),
      versionNumber: '1',
      deployTo: [documentEnv],
      deploymentStrategy,
    });

    // S3 as configuration source
    const bucketEnv = app.addEnvironment('BucketEnv');
    const bucket = new Bucket(this, 'MyBucket', {
      versioned: true,
    });
    bucket.applyRemovalPolicy(RemovalPolicy.DESTROY);
    const deployment = new s3Deployment.BucketDeployment(this, 'DeployConfigInBucket', {
      sources: [s3Deployment.Source.data('hello/world/file.txt', 'This is the content stored in S3')],
      destinationBucket: bucket,
      retainOnDelete: false,
    });
    new SourcedConfiguration(this, 'MyConfigFromBucket', {
      application: app,
      location: ConfigurationSource.fromBucket(bucket, 'hello/world/file.txt'),
      description: `Sourced from ${Fn.select(0, deployment.objectKeys)}`,
      deployTo: [bucketEnv],
    });

    // secrets manager as configuration source (without key)
    const secretEnv = app.addEnvironment('SecretEnv');
    const secret = new Secret(this, 'MySecret', {
      secretStringValue: SecretValue.unsafePlainText('This is the content stored in secrets manager'),
    });
    new SourcedConfiguration(this, 'MyConfigFromSecret', {
      application: app,
      location: ConfigurationSource.fromSecret(secret),
      deployTo: [secretEnv],
    });

    // secrets manager as configuration source (with key)
    const secretWithKeyEnv = app.addEnvironment('SecretEnvWithKey');
    const key = new Key(this, 'MyKey');
    const secretWithKey = new Secret(this, 'MySecretWithKey', {
      secretStringValue: SecretValue.unsafePlainText('This is the content stored in secrets manager'),
      encryptionKey: key,
    });
    new SourcedConfiguration(this, 'MyConfigFromSecretWithKey', {
      location: ConfigurationSource.fromSecret(secretWithKey, key),
      deploymentKey: key,
      application: app,
      deployTo: [secretWithKeyEnv],
    });

    // code pipeline as configuration source
    deployment.addSource(s3Deployment.Source.data('hello/world/codepipeline.txt', 'This is the content stored in code pipeline'));
    const sourceAction = new S3SourceAction({
      actionName: 'Source',
      bucket: bucket,
      bucketKey: 'hello/world/codepipeline.txt',
      output: new Artifact('SourceOutput'),
    });
    const deployAction = new S3DeployAction({
      actionName: 'Deploy',
      input: Artifact.artifact('SourceOutput'),
      bucket: bucket,
      extract: true,
    });
    const pipeline = new Pipeline(this, 'MyPipeline', {
      stages: [
        {
          stageName: 'beta',
          actions: [sourceAction],
        },
        {
          stageName: 'prod',
          actions: [deployAction],
        },
      ],
    });
    new SourcedConfiguration(this, 'MyConfigFromPipeline', {
      application: app,
      location: ConfigurationSource.fromPipeline(pipeline),
    });
  }
}

const app = new App();
new AppConfigTestStack(app, 'AppConfigTestStack');
app.synth();