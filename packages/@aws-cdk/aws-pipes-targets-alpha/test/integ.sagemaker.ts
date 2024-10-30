import { Pipe } from '@aws-cdk/aws-pipes-alpha';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SqsSource } from '@aws-cdk/aws-pipes-sources-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as sagemaker from 'aws-cdk-lib/aws-sagemaker';
import { Construct } from 'constructs';
import { SageMakerTarget } from '../lib/sagemaker';

/*
 * This integration test sends a message to an SQS queue which
 * invokes a SageMaker pipeline.
 *
 * SQS (pipe source) --> SageMaker pipeline (pipe target)
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-sagemaker');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');

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

    const pipelineRole = new iam.Role(this, 'SageMakerPipelineRole', {
      assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
    });
    pipelineRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'));

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

  public grantStartPipelineExecution(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['sagemaker:StartPipelineExecution'],
      resourceArns: [this.pipelineArn],
    });
  }
}

const targetPipeline = new FakePipeline(stack, 'Pipeline', {
  pipelineName: 'my-pipeline',
});

new Pipe(stack, 'Pipe', {
  source: new SqsSource(sourceQueue),
  target: new SageMakerTarget(targetPipeline, {
    pipelineParameters: {
      foor: 'bar',
    },
  }),
});

const test = new IntegTest(app, 'integtest-pipe-target-sagemaker', {
  testCases: [stack],
});

const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: 'Nebraska',
});

const message = putMessageOnQueue.next(test.assertions.awsApiCall('SageMaker', 'ListPipelineExecutions', {
  PipelineName: targetPipeline.pipelineName,
}));

// The pipeline won't succeed, but we want to test that it was started.
message.assertAtPath('PipelineExecutionSummaries.0.PipelineExecutionArn', ExpectedResult.stringLikeRegexp(targetPipeline.pipelineArn))
  .waitForAssertions({
    totalTimeout: cdk.Duration.minutes(2),
    interval: cdk.Duration.seconds(10),
  });

app.synth();
