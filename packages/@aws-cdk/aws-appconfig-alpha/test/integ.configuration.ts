import { App, Duration, Stack, RemovalPolicy, Fn, SecretValue } from 'aws-cdk-lib';
import {
  Application,
  ConfigurationContent,
  ConfigurationSource,
  DeploymentStrategy,
  HostedConfiguration,
  JsonSchemaValidator,
  LambdaValidator,
  RolloutStrategy,
  SourcedConfiguration,
} from '../lib';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { CfnDocument, StringParameter } from 'aws-cdk-lib/aws-ssm';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { S3DeployAction, S3SourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

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

const app = new App();

const stack = new Stack(app, 'aws-appconfig-configuration');

// create application for config profile
const appConfigApp = new Application(stack, 'MyAppConfig', {
  name: 'AppForConfigTest',
});

const deploymentStrategy = new DeploymentStrategy(stack, 'MyDeployStrategy', {
  rolloutStrategy: RolloutStrategy.linear({
    growthFactor: 100,
    deploymentDuration: Duration.minutes(0),
  }),
});

// hosted config from file
new HostedConfiguration(stack, 'MyHostedConfigFromFile', {
  application: appConfigApp,
  content: ConfigurationContent.fromFile('config.json'),
});

// create basic config profile and add config version
const hostedEnv = appConfigApp.addEnvironment('HostedEnv');
new HostedConfiguration(stack, 'MyHostedConfig', {
  application: appConfigApp,
  content: ConfigurationContent.fromInlineText('This is my configuration content.'),
  deployTo: [hostedEnv],
  validators: [
    JsonSchemaValidator.fromInline(SCHEMA_STR),
    JsonSchemaValidator.fromFile('schema.json'),
  ],
  deploymentStrategy,
});

// create basic config profile from add config version from file
const hostedEnvFromJson = appConfigApp.addEnvironment('HostedEnvFromJson');
const config = new HostedConfiguration(stack, 'MyHostedConfigFromJson', {
  application: appConfigApp,
  content: ConfigurationContent.fromInlineText('This is the configuration content'),
  deployTo: [hostedEnvFromJson],
  deploymentStrategy,
});

const hostedEnvFromYaml = appConfigApp.addEnvironment('HostedEnvFromYaml');
new HostedConfiguration(stack, 'MyHostedConfigFromYaml', {
  application: appConfigApp,
  content: ConfigurationContent.fromInlineYaml('This is the configuration content'),
  deployTo: [hostedEnvFromYaml],
  deploymentStrategy,
});

// verify a configuration can be deployed through the deploy method
const envToDeployLater = appConfigApp.addEnvironment('EnvDeployLater');
config.deploy(envToDeployLater);

// ssm paramter as configuration source
const func = new Function(stack, 'MyValidatorFunction', {
  runtime: Runtime.PYTHON_3_8,
  handler: 'index.handler',
  code: Code.fromInline(LAMBDA_CODE),
});
const parameterEnv = appConfigApp.addEnvironment('ParameterEnv');
const ssmParameter = new StringParameter(stack, 'MyParameter', {
  stringValue: 'This is the content stored in ssm parameter',
});
new SourcedConfiguration(stack, 'MyConfigFromParameter', {
  name: 'TestConfigProfileStoredAsParamater',
  application: appConfigApp,
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
const documentEnv = appConfigApp.addEnvironment('DocumentEnv');
const ssmDocument = new CfnDocument(stack, 'MyDocument', {
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
new SourcedConfiguration(stack, 'MyConfigFromDocument', {
  application: appConfigApp,
  location: ConfigurationSource.fromCfnDocument(ssmDocument),
  versionNumber: '1',
  deployTo: [documentEnv],
  deploymentStrategy,
});

// S3 as configuration source
const bucketEnv = appConfigApp.addEnvironment('BucketEnv');
const bucket = new Bucket(stack, 'MyBucket', {
  versioned: true,
  removalPolicy: RemovalPolicy.DESTROY,
});
bucket.applyRemovalPolicy(RemovalPolicy.DESTROY);
const deployment = new s3Deployment.BucketDeployment(stack, 'DeployConfigInBucket', {
  sources: [s3Deployment.Source.data('hello/world/file.txt', 'This is the content stored in S3')],
  destinationBucket: bucket,
  retainOnDelete: false,
});
new SourcedConfiguration(stack, 'MyConfigFromBucket', {
  application: appConfigApp,
  location: ConfigurationSource.fromBucket(bucket, 'hello/world/file.txt'),
  description: `Sourced from ${Fn.select(0, deployment.objectKeys)}`,
  deployTo: [bucketEnv],
});

// secrets manager as configuration source (without key)
const secretEnv = appConfigApp.addEnvironment('SecretEnv');
const secret = new Secret(stack, 'MySecret', {
  secretStringValue: SecretValue.unsafePlainText('This is the content stored in secrets manager'),
});
new SourcedConfiguration(stack, 'MyConfigFromSecret', {
  application: appConfigApp,
  location: ConfigurationSource.fromSecret(secret),
  deployTo: [secretEnv],
});

// secrets manager as configuration source (with key)
const secretWithKeyEnv = appConfigApp.addEnvironment('SecretEnvWithKey');
const key = new Key(stack, 'MyKey');
const secretWithKey = new Secret(stack, 'MySecretWithKey', {
  secretStringValue: SecretValue.unsafePlainText('This is the content stored in secrets manager'),
  encryptionKey: key,
});
new SourcedConfiguration(stack, 'MyConfigFromSecretWithKey', {
  location: ConfigurationSource.fromSecret(secretWithKey),
  deploymentKey: key,
  application: appConfigApp,
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
const pipeline = new Pipeline(stack, 'MyPipeline', {
  crossAccountKeys: true,
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
new SourcedConfiguration(stack, 'MyConfigFromPipeline', {
  application: appConfigApp,
  location: ConfigurationSource.fromPipeline(pipeline),
});

new IntegTest(app, 'appconfig-configuration', {
  testCases: [stack],
  cdkCommandOptions: {
    destroy: {
      args: {
        force: true,
      },
    },
  },
});