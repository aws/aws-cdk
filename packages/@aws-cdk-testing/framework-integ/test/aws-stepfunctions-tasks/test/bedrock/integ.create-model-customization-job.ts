import * as bedrock from 'aws-cdk-lib/aws-bedrock';
// import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { BedrockCreateModelCustomizationJob, CustomizationType } from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-bedrock-invoke-model-integ');

// const vpc = new ec2.Vpc(stack, 'Vpc', {
//   natGateways: 0,
// });

const model = bedrock.FoundationModel.fromFoundationModelId(
  stack,
  'Model',
  bedrock.FoundationModelIdentifier.AMAZON_TITAN_TEXT_G1_EXPRESS_V1,
);

const outputBucket = new s3.Bucket(stack, 'OutputBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const trainingBucket = new s3.Bucket(stack, 'TrainingBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const validationBucket = new s3.Bucket(stack, 'ValidationBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const kmsKey = new kms.Key(stack, 'KmsKey', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const task = new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomizationJob', {
  baseModel: model,
  clientRequestToken: 'MyToken',
  customizationType: CustomizationType.FINE_TUNING,
  kmsKey,
  customModelName: 'MyCustomModel',
  customModelTags: [{ key: 'key1', value: 'value1' }],
  hyperParameters: {
    batchSize: '10',
  },
  jobName: 'MyJob',
  jobTags: [{ key: 'key2', value: 'value2' }],
  outputDataS3Uri: outputBucket.s3UrlForObject(),
  trainingDataS3Uri: trainingBucket.s3UrlForObject(),
  validationDataS3Uri: [validationBucket.s3UrlForObject()],
  role: new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
  }),
  // vpcConfig: {
  //   securityGroups: [new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc })],
  //   subnets: vpc.privateSubnets,
  // },
});

const chain = sfn.Chain.start(new sfn.Pass(stack, 'Start')).next(task).next(new sfn.Pass(stack, 'Done'));

new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(chain),
  timeout: cdk.Duration.seconds(30),
});

new IntegTest(app, 'InvokeModel', {
  testCases: [stack],
});

app.synth();
