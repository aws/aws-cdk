import * as scheduler from '@aws-cdk/aws-scheduler-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnPipeline } from 'aws-cdk-lib/aws-sagemaker';
import { SageMakerPipelineParameter, SageMakerStartPipelineExecution } from '../lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-scheduler-targets-sagemaker-start-pipeline-execution');

const sourceBucket = new Bucket(stack, 'SourceBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const outputBucket = new Bucket(stack, 'OutputBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
// dummy definition for the integ test execution
const pipelineDefinition = {
  PipelineDefinitionBody: JSON.stringify({
    Version: '2020-12-01',
    Metadata: {},
    Parameters: [
      {
        Name: 'ParameterName',
        Type: 'String',
        DefaultValue: 'Value',
      },
    ],
    Steps: [
      {
        Name: 'TrainingStep',
        Type: 'Training',
        Arguments: {
          AlgorithmSpecification: {
            TrainingImage: '382416733822.dkr.ecr.us-east-1.amazonaws.com/linear-learner:1',
            TrainingInputMode: 'File',
          },
          InputDataConfig: [
            {
              DataSource: {
                S3DataSource: {
                  S3Uri: sourceBucket.s3UrlForObject(),
                },
              },
            },
          ],
          OutputDataConfig: {
            S3OutputPath: outputBucket.s3UrlForObject(),
          },
          ResourceConfig: {
            InstanceCount: 1,
            InstanceType: 'ml.m5.large',
            VolumeSizeInGB: 50,
          },
          StoppingCondition: {
            MaxRuntimeInSeconds: 3600,
          },
        },
      },
    ],
  }),
};

const pipelineRole = new Role(stack, 'SageMakerPipelineRole', {
  assumedBy: new ServicePrincipal('sagemaker.amazonaws.com'),
});
pipelineRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'));
const pipelineParameterList: SageMakerPipelineParameter[] = [{
  name: 'ParameterName',
  value: 'ParameterValue',
}];
const pipeline = new CfnPipeline(stack, 'Pipeline', {
  pipelineName: 'my-pipeline',
  pipelineDefinition: pipelineDefinition,
  roleArn: pipelineRole.roleArn,
});

new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(10)),
  target: new SageMakerStartPipelineExecution(pipeline, {
    pipelineParameterList,
  }),
});

const integrationTest = new IntegTest(app, 'integrationtest-sagemaker-start-pipeline-execution', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this would cause the schedule to trigger with the old code
});

integrationTest.assertions.awsApiCall('Sagemaker', 'listPipelineExecutions', {
  PipelineName: 'my-pipeline',
}).assertAtPath(
  'PipelineExecutionSummaries.0.PipelineExecutionArn',
  ExpectedResult.stringLikeRegexp('my-pipeline'),
).waitForAssertions({
  interval: cdk.Duration.seconds(30),
  totalTimeout: cdk.Duration.minutes(10),
});

app.synth();