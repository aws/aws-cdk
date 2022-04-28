import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import {
  AthenaOutputFormat,
  CompressionType,
  DockerImage,
  InputMode,
  RedshiftOutputFormat,
  S3DataDistributionType,
  S3DataType,
  S3Location,
  S3UploadMode,
  SageMakerCreateProcessingJob,
} from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('create basic processing job', () => {
  // WHEN
  const task = new SageMakerCreateProcessingJob(stack, 'ProcessSagemaker', {
    image: DockerImage.fromJsonExpression(sfn.JsonPath.stringAt('$.ImageName')),
    processingJobName: 'MyProcessJob',
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    End: true,
    Parameters:
      {
        ProcessingJobName: 'MyProcessJob',
        RoleArn: { 'Fn::GetAtt': ['ProcessSagemakerSagemakerRole51617436', 'Arn'] },
        AppSpecification: {
          'ImageUri.$': '$.ImageName',
        },
        ProcessingResources: {
          ClusterConfig: {
            InstanceCount: 1,
            InstanceType: 'ml.m4.xlarge',
            VolumeSizeInGB: 10,
          },
        },
        StoppingCondition: { MaxRuntimeInSeconds: 3600 },
      },
    Type: 'Task',
    Resource: {
      'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':states:::sagemaker:createProcessingJob']],
    },
  });
});

test('create complex processing job', () => {
  // WHEN
  const key = new kms.Key(stack, 'Key');
  const vpc = new ec2.Vpc(stack, 'VPC');
  const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc, description: 'My SG' });
  securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from the world');

  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'),
    ],
  });

  const processTask = new SageMakerCreateProcessingJob(stack, 'ProcessSagemaker', {
    processingJobName: sfn.JsonPath.stringAt('$.ProcessJobName'),
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    role,
    containerArgs: ['arg1', 'arg2'],
    containerEntrypoint: ['a'],
    image: DockerImage.fromJsonExpression(sfn.JsonPath.stringAt('$.ImageName')),
    environment: {
      key1: '0.1',
      key2: 'value2',
    },
    experimentConfig: {
      experimentName: 'expName',
      trialComponentDisplayName: 'X',
      trialName: 'test-one',
    },
    networkConfig: {
      enableTraffic: true,
      enableIsolation: true,
      vpcConfig: {
        vpc: vpc,
      },
    },
    processingInputs: [
      {
        inputName: 'inputOne',
        s3Input: {
          localPathPrefix: 'processing-input-one',
          s3CompressionType: CompressionType.GZIP,
          s3DataDistributionType: S3DataDistributionType.SHARDED_BY_S3_KEY,
          s3DataType: S3DataType.S3_PREFIX,
          s3InputMode: InputMode.FILE,
          s3Location: S3Location.fromJsonExpression('$.S3Bucket.ProcessingInput.One'),
        },
      },
      {
        inputName: 'inputTwo',
        s3Input: {
          localPathPrefix: 'processing-input-two',
          s3CompressionType: CompressionType.NONE,
          s3DataDistributionType: S3DataDistributionType.FULLY_REPLICATED,
          s3DataType: S3DataType.S3_PREFIX,
          s3InputMode: InputMode.FILE,
          s3Location: S3Location.fromJsonExpression('$.S3Bucket.ProcessingInput.Two'),
        },
      },
    ],
    processingOutputKey: key,
    processingOutputs: [
      {
        outputName: 'processing-output-one',
        s3Output: {
          localPathPrefix: 'processing-output-one',
          s3UploadMode: S3UploadMode.END_OF_JOB,
          s3Location: S3Location.fromJsonExpression('$.S3Bucket.ProcessingInput.One'),
        },
      },
      {
        outputName: 'processing-output-two',
        s3Output: {
          localPathPrefix: 'processing-output-two',
          s3UploadMode: S3UploadMode.CONTINUOUS,
          s3Location: S3Location.fromJsonExpression('$.S3Bucket.ProcessingInput.Two'),
        },
      },
    ],
    processingCluster: {
      instanceCount: 3,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.P3, ec2.InstanceSize.XLARGE2),
      volumeSize: cdk.Size.gibibytes(50),
      volumeEncryptionKey: key,
    },
    stoppingCondition: {
      maxRuntime: cdk.Duration.hours(4),
    },
    tags: {
      Project: 'MyProject',
    },
  });
  processTask.addSecurityGroup(securityGroup);

  // THEN
  expect(stack.resolve(processTask.toStateJson())).toEqual({
    End: true,
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':states:::sagemaker:createProcessingJob.sync',
        ],
      ],
    },
    Parameters: {
      'ProcessingJobName.$': '$.ProcessJobName',
      'RoleArn': { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
      'AppSpecification': {
        'ContainerArguments': ['arg1', 'arg2'],
        'ContainerEntrypoint': ['a'],
        'ImageUri.$': '$.ImageName',
      },
      'ExperimentConfig': {
        ExperimentName: 'expName',
        TrialComponentDisplayName: 'X',
        TrialName: 'test-one',
      },
      'NetworkConfig': {
        EnableInterContainerTrafficEncryption: true,
        EnableNetworkIsolation: true,
        VpcConfig: {
          SecurityGroupIds: [
            {
              'Fn::GetAtt': [
                'ProcessSagemakerProcessJobSecurityGroup4B879B7C',
                'GroupId',
              ],
            },
            { 'Fn::GetAtt': ['SecurityGroupDD263621', 'GroupId'] },
          ],
          Subnets: [
            { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
            { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
          ],
        },
      },
      'ProcessingInputs': [
        {
          AppManaged: false,
          InputName: 'inputOne',
          S3Input: {
            'LocalPath': '/opt/ml/processing/inputs/s3/processing-input-one/',
            'S3CompressionType': 'Gzip',
            'S3DataDistributionType': 'ShardedByS3Key',
            'S3DataType': 'S3Prefix',
            'S3InputMode': 'File',
            'S3Uri.$': '$.S3Bucket.ProcessingInput.One',
          },
        },
        {
          AppManaged: false,
          InputName: 'inputTwo',
          S3Input: {
            'LocalPath': '/opt/ml/processing/inputs/s3/processing-input-two/',
            'S3CompressionType': 'None',
            'S3DataDistributionType': 'FullyReplicated',
            'S3DataType': 'S3Prefix',
            'S3InputMode': 'File',
            'S3Uri.$': '$.S3Bucket.ProcessingInput.Two',
          },
        },
      ],
      'ProcessingOutputConfig': {
        KmsKeyId: { Ref: 'Key961B73FD' },
        Outputs: [
          {
            AppManaged: false,
            OutputName: 'processing-output-one',
            S3Output: {
              'LocalPath': '/opt/ml/processing/outputs/s3/processing-output-one/',
              'S3UploadMode': 'EndOfJob',
              'S3Uri.$': '$.S3Bucket.ProcessingInput.One',
            },
          },
          {
            AppManaged: false,
            OutputName: 'processing-output-two',
            S3Output: {
              'LocalPath': '/opt/ml/processing/outputs/s3/processing-output-two/',
              'S3UploadMode': 'Continuous',
              'S3Uri.$': '$.S3Bucket.ProcessingInput.Two',
            },
          },
        ],
      },
      'ProcessingResources': {
        ClusterConfig: {
          InstanceCount: 3,
          InstanceType: 'ml.p3.2xlarge',
          VolumeSizeInGB: 50,
          VolumeKmsKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        },
      },
      'StoppingCondition': { MaxRuntimeInSeconds: 14400 },
      'Environment': {
        key1: '0.1',
        key2: 'value2',
      },
      'Tags': [{ Key: 'Project', Value: 'MyProject' }],
    },
  });
});

test('pass param to processing job', () => {
  // WHEN
  const task = new SageMakerCreateProcessingJob(stack, 'ProcessSagemaker', {
    image: DockerImage.fromJsonExpression(sfn.JsonPath.stringAt('$.ImageName')),
    processingJobName: 'MyProcessJob',
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    End: true,
    Parameters:
        {
          ProcessingJobName: 'MyProcessJob',
          RoleArn: { 'Fn::GetAtt': ['ProcessSagemakerSagemakerRole51617436', 'Arn'] },
          AppSpecification: {
            'ImageUri.$': '$.ImageName',
          },
          ProcessingResources: {
            ClusterConfig: {
              InstanceCount: 1,
              InstanceType: 'ml.m4.xlarge',
              VolumeSizeInGB: 10,
            },
          },
          StoppingCondition: { MaxRuntimeInSeconds: 3600 },
        },
    Type: 'Task',
    Resource: {
      'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':states:::sagemaker:createProcessingJob']],
    },
  });
});

test('Constructor throws if processing job is created with conflicting inputs', () => {
  expect(() => {
    new SageMakerCreateProcessingJob(stack, 'ProcessSagemaker', {
      image: DockerImage.fromJsonExpression(sfn.JsonPath.stringAt('$.ImageName')),
      processingInputs: [
        {
          inputName: 'conflictingInputTest',
          datasetDefinition: {
            athenaDatasetDefinition: {
              catalog: 'testCatalog',
              database: 'testDatabase',
              outputFormat: AthenaOutputFormat.PARQUET,
              s3Location: S3Location.fromJsonExpression('$.S3Bucket.ProcessingInput.Conflicting'),
              queryString: 'SELECT * FROM test_table_name',
            },
          },
          s3Input: {
            localPathPrefix: 'conflicting',
            s3CompressionType: CompressionType.GZIP,
            s3DataDistributionType: S3DataDistributionType.SHARDED_BY_S3_KEY,
            s3DataType: S3DataType.S3_PREFIX,
            s3InputMode: InputMode.FILE,
            s3Location: S3Location.fromJsonExpression('$.S3Bucket.ProcessingInput.Conflicting'),
          },
        },
      ],
      processingJobName: 'MyProcessJob',
    });
  }).toThrow(/ProcessingInput must contain exactly one of either S3Input or DatasetDefinition/i);
});

test('Constructor throws if processing job is created with conflicting input dataset definitions', () => {
  expect(() => {
    const clusterRole = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('redshift.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonRedshiftFullAccess'),
      ],
    });

    new SageMakerCreateProcessingJob(stack, 'ProcessSagemaker', {
      image: DockerImage.fromJsonExpression(sfn.JsonPath.stringAt('$.ImageName')),
      processingInputs: [
        {
          inputName: 'conflictingInputTest',
          datasetDefinition: {
            athenaDatasetDefinition: {
              catalog: 'testCatalog',
              database: 'testDatabase',
              outputFormat: AthenaOutputFormat.PARQUET,
              s3Location: S3Location.fromJsonExpression('$.S3Bucket.ProcessingInput.One'),
              queryString: 'SELECT * FROM test_table_name',
            },
            redshiftDatasetDefinition: {
              clusterId: 'testClusterId',
              clusterRole: clusterRole,
              database: 'testDatabase',
              dbUser: 'testDbUser',
              outputFormat: RedshiftOutputFormat.PARQUET,
              s3Location: S3Location.fromJsonExpression('$.S3Bucket.ProcessingInput.Two'),
              queryString: 'SELECT * FROM test_table_name',
            },
          },
        },
      ],
      processingJobName: 'MyProcessJob',
    });
  }).toThrow(/DatasetDefinition must contain exactly one of either AthenaDatasetDefinition or RedshiftDatasetDefinition/i);
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new SageMakerCreateProcessingJob(stack, 'ProcessSagemaker', {
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      image: DockerImage.fromJsonExpression(sfn.JsonPath.stringAt('$.ImageName')),
      processingJobName: 'MyProcessJob',
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/i);
});

