import * as ec2 from '../../../aws-ec2';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('create basic model', () => {
  // WHEN
  const task = new tasks.SageMakerCreateModel(stack, 'SagemakerModel', {
    modelName: 'MyModel',
    primaryContainer: new tasks.ContainerDefinition({
      image: tasks.DockerImage.fromJsonExpression(sfn.JsonPath.stringAt('$.Model.imageName')),
      mode: tasks.Mode.SINGLE_MODEL,
      modelS3Location: tasks.S3Location.fromJsonExpression('$.TrainingJob.ModelArtifacts.S3ModelArtifacts'),
    }),
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::sagemaker:createModel',
        ],
      ],
    },
    End: true,
    Parameters: {
      ExecutionRoleArn: { 'Fn::GetAtt': ['SagemakerModelSagemakerRoleF5035084', 'Arn'] },
      ModelName: 'MyModel',
      PrimaryContainer: {
        'Image.$': '$.Model.imageName',
        'ModelDataUrl.$': '$.TrainingJob.ModelArtifacts.S3ModelArtifacts',
        'Mode': 'SingleModel',
      },
    },
  },
  );
});

test('create complex model', () => {
  // WHEN
  const vpc = new ec2.Vpc(stack, 'VPC');
  const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc, description: 'My SG' });
  securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from the world');
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'),
    ],
  });

  const task = new tasks.SageMakerCreateModel(stack, 'SagemakerModel', {
    modelName: sfn.JsonPath.stringAt('$.ModelName'),
    primaryContainer: new tasks.ContainerDefinition({
      image: tasks.DockerImage.fromJsonExpression(sfn.JsonPath.stringAt('$.Model.imageName')),
      mode: tasks.Mode.MULTI_MODEL,
      modelS3Location: tasks.S3Location.fromJsonExpression('$.TrainingJob.ModelArtifacts.S3ModelArtifacts'),
    }),
    enableNetworkIsolation: true,
    role,
    tags: sfn.TaskInput.fromObject([{
      Key: 'Project',
      Value: 'ML',
    }]),
    vpc,
  });
  task.addSecurityGroup(securityGroup);

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::sagemaker:createModel',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ExecutionRoleArn': { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
      'ModelName.$': '$.ModelName',
      'PrimaryContainer': {
        'Image.$': '$.Model.imageName',
        'ModelDataUrl.$': '$.TrainingJob.ModelArtifacts.S3ModelArtifacts',
        'Mode': 'MultiModel',
      },
      'EnableNetworkIsolation': true,
      'Tags': [
        { Key: 'Project', Value: 'ML' },
      ],
      'VpcConfig': {
        SecurityGroupIds: [
          { 'Fn::GetAtt': ['SecurityGroupDD263621', 'GroupId'] },
          { 'Fn::GetAtt': ['SagemakerModelModelSecurityGroup4D2A2C36', 'GroupId'] },
        ],
        Subnets: [
          { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
          { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
        ],
      },
    },
  },
  );
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new tasks.SageMakerCreateModel(stack, 'Sagemaker', {
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      modelName: 'MyModel',
      primaryContainer: new tasks.ContainerDefinition({
        image: tasks.DockerImage.fromJsonExpression(sfn.JsonPath.stringAt('$.Model.imageName')),
        mode: tasks.Mode.SINGLE_MODEL,
        modelS3Location: tasks.S3Location.fromJsonExpression('$.TrainingJob.ModelArtifacts.S3ModelArtifacts'),
      }),
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: WAIT_FOR_TASK_TOKEN/i);
});
