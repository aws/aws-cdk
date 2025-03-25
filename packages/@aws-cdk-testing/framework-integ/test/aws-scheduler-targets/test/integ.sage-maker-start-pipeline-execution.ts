import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Grant, IGrantable, ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as sagemaker from 'aws-cdk-lib/aws-sagemaker';
import { Construct } from 'constructs';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import { SageMakerPipelineParameter, SageMakerStartPipelineExecution } from 'aws-cdk-lib/aws-scheduler-targets';

interface FakePipelineProps {
  readonly pipelineName: string;
}

class FakePipeline extends cdk.Resource implements sagemaker.IPipeline {
  public readonly pipelineArn;
  public readonly pipelineName;
  constructor(scope: Construct, id: string, props: FakePipelineProps) {
    super(scope, id, {
      physicalName: props.pipelineName,
    });
    this.pipelineName = props.pipelineName;

    const sourceBucket = new Bucket(this, 'SourceBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    const outputBucket = new Bucket(this, 'OutputBucket', {
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

    const pipelineRole = new Role(this, 'SageMakerPipelineRole', {
      assumedBy: new ServicePrincipal('sagemaker.amazonaws.com'),
    });
    pipelineRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'));

    const pipeline = new sagemaker.CfnPipeline(this, 'Resource', {
      pipelineName: this.pipelineName,
      pipelineDefinition: pipelineDefinition,
      roleArn: pipelineRole.roleArn,
    });

    this.pipelineArn = cdk.Stack.of(pipeline).formatArn({
      service: 'sagemaker',
      resource: 'pipeline',
      resourceName: pipeline.pipelineName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  public grantStartPipelineExecution(grantee: IGrantable): Grant {
    return Grant.addToPrincipal({
      grantee,
      actions: ['sagemaker:StartPipelineExecution'],
      resourceArns: [this.pipelineArn],
    });
  }
}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-scheduler-targets-sagemaker-start-pipeline-execution');

const pipelineParameterList: SageMakerPipelineParameter[] = [{
  name: 'ParameterName',
  value: 'ParameterValue',
}];
const pipeline = new FakePipeline(stack, 'Pipeline', {
  pipelineName: 'my-pipeline',
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
