import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { BedrockCreateModelCustomizationJob } from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-bedrock-invoke-model-integ');

const model = bedrock.FoundationModel.fromFoundationModelId(
  stack,
  'Model',
  bedrock.FoundationModelIdentifier.AMAZON_TITAN_TEXT_G1_EXPRESS_V1,
);

const outputBucket = new s3.Bucket(stack, 'OutputBucket');
const trainingBucket = new s3.Bucket(stack, 'TrainingBucket');
const validationBucket = new s3.Bucket(stack, 'ValidationBucket');

const kmsKey = new kms.Key(stack, 'KmsKey');

const task = new BedrockCreateModelCustomizationJob(stack, 'CreateModelCustomizationJob', {
  baseModel: model,
  kmsKey,
  customModelName: 'MyCustomModel',
  hyperParameters: {
    epochs: '10',
  },
  jobName: 'MyJob',
  outputDataS3Uri: outputBucket.s3UrlForObject(),
  trainingDataS3Uri: trainingBucket.s3UrlForObject(),
  validationDataS3Uri: [validationBucket.s3UrlForObject()],
  role: new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
  }),
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
