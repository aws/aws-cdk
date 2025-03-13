import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-bedrock-invoke-model-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  natGateways: 0,
  subnetConfiguration: [
    {
      cidrMask: 24,
      name: 'Isolated',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    },
    {
      cidrMask: 24,
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
    },
  ],
});

const model = bedrock.FoundationModel.fromFoundationModelId(
  stack,
  'Model',
  bedrock.FoundationModelIdentifier.AMAZON_TITAN_TEXT_G1_EXPRESS_V1,
);

const outputBucket = new s3.Bucket(stack, 'OutputBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const trainingBucket = new s3.Bucket(stack, 'TrainingBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const validationBucket = new s3.Bucket(stack, 'ValidationBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const kmsKey = new kms.Key(stack, 'KmsKey', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const taskConfig: tasks.BedrockCreateModelCustomizationJobProps = {
  baseModel: model,
  clientRequestToken: 'MyToken',
  customizationType: tasks.CustomizationType.FINE_TUNING,
  customModelKmsKey: kmsKey,
  customModelName: 'MyCustomModel',
  customModelTags: [{ key: 'key1', value: 'value1' }],
  hyperParameters: {
    batchSize: '10',
  },
  jobName: 'MyCustomizationJob',
  jobTags: [{ key: 'key2', value: 'value2' }],
  outputData: {
    bucket: outputBucket,
    path: 'output-data',
  },
  trainingData: {
    bucket: trainingBucket,
    path: 'training-data',
  },
};

const task1 = new tasks.BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomizationJob1', {
  ...taskConfig,
  vpcConfig: {
    securityGroups: [new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc })],
    subnets: vpc.isolatedSubnets,
  },
  validationData: [
    {
      bucket: validationBucket,
      path: 'validation-data1',
    },
    {
      bucket: validationBucket,
      path: 'validation-data2',
    },
  ],
});

const task2 = new tasks.BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomizationJob2', {
  ...taskConfig,
  clientRequestToken: 'MyToken2',
  customModelName: 'MyCustomModel2',
  jobName: 'MyCustomizationJob2',
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  hyperParameters: {
    'Evaluation percentage': '10',
  },
});

const chain = sfn.Chain
  .start(new sfn.Pass(stack, 'Start'))
  .next(task1)
  .next(task2)
  .next(new sfn.Pass(stack, 'Done'));

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(chain),
  timeout: cdk.Duration.seconds(30),
});

const integ = new IntegTest(app, 'CreateModelCustomizationJob', {
  testCases: [stack],
});

integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
}).waitForAssertions();
