import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CfnPipeline } from 'aws-cdk-lib/aws-sagemaker';
import * as sagemaker from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-sagemaker-alpha-pipeline-import');

// Create supporting resources for the pipeline
const sourceBucket = new Bucket(stack, 'SourceBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const outputBucket = new Bucket(stack, 'OutputBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const pipelineRole = new Role(stack, 'PipelineRole', {
  assumedBy: new ServicePrincipal('sagemaker.amazonaws.com'),
});
pipelineRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'));

// Create a minimal SageMaker Pipeline using L1 construct
const cfnPipeline = new CfnPipeline(stack, 'TestPipeline', {
  pipelineName: 'test-import-pipeline-alpha',
  pipelineDefinition: {
    PipelineDefinitionBody: JSON.stringify({
      Version: '2020-12-01',
      Metadata: {},
      Parameters: [
        {
          Name: 'InputPath',
          Type: 'String',
          DefaultValue: sourceBucket.s3UrlForObject('input/'),
        },
      ],
      Steps: [
        {
          Name: 'ProcessingStep',
          Type: 'Processing',
          Arguments: {
            ProcessingResources: {
              ClusterConfig: {
                InstanceCount: 1,
                InstanceType: 'ml.t3.medium',
                VolumeSizeInGB: 20,
              },
            },
            AppSpecification: {
              ImageUri: '382416733822.dkr.ecr.us-east-1.amazonaws.com/sagemaker-scikit-learn:0.23-1-cpu-py3',
              ContainerEntrypoint: ['python3'],
              ContainerArguments: ['-c', 'print("Hello from SageMaker Pipeline!")'],
            },
            ProcessingOutputConfig: {
              Outputs: [
                {
                  OutputName: 'output',
                  S3Output: {
                    S3Uri: outputBucket.s3UrlForObject('output/'),
                    LocalPath: '/opt/ml/processing/output',
                  },
                },
              ],
            },
          },
        },
      ],
    }),
  },
  roleArn: pipelineRole.roleArn,
});

// Test importing by pipeline name
const importedByName = sagemaker.Pipeline.fromPipelineName(
  stack,
  'ImportedByName',
  cfnPipeline.pipelineName!,
);

// Test importing by ARN
const pipelineArn = cdk.Stack.of(stack).formatArn({
  service: 'sagemaker',
  resource: 'pipeline',
  resourceName: cfnPipeline.pipelineName!,
});

const importedByArn = sagemaker.Pipeline.fromPipelineArn(
  stack,
  'ImportedByArn',
  pipelineArn,
);

// Test IAM permissions
const testRole = new Role(stack, 'TestRole', {
  assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
});

importedByName.grantStartPipelineExecution(testRole);

// Output the pipeline details for verification
new cdk.CfnOutput(stack, 'PipelineName', {
  value: importedByName.pipelineName,
  description: 'Name of the imported pipeline',
});

new cdk.CfnOutput(stack, 'PipelineArn', {
  value: importedByArn.pipelineArn,
  description: 'ARN of the imported pipeline',
});

new IntegTest(app, 'sagemaker-alpha-pipeline-import-test', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});
