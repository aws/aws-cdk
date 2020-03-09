import '@aws-cdk/assert/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

let stack: cdk.Stack;

beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
});

test('create basic model', () => {
    // WHEN
    const task = new sfn.Task(stack, 'Create Model', { task: new tasks.SagemakerCreateModelTask({
        modelName: 'MyModel',
        primaryContainer: {
          image: tasks.DockerImage.fromRegistry(sfn.Data.stringAt('$.TrainingJob.image_name')),
          mode: tasks.ModelContainerMode.SINGLEMODEL,
          modelDataUrl: sfn.Data.stringAt("$.TrainingJob.ModelArtifacts.S3ModelArtifacts")
        }
      }),
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      Resource: {
        "Fn::Join": [
          "",
          [
            "arn:",
            {
              Ref: "AWS::Partition",
            },
            ":states:::sagemaker:createModel",
          ],
        ],
      },
      End: true,
      Parameters: {
        ExecutionRoleArn:  {
            "Fn::GetAtt":  ["CreateModelSagemakerRoleC2E07FC0", "Arn", ]
            },
        ModelName: 'MyModel',
        PrimaryContainer: {
            'Image.$': '$.TrainingJob.image_name',
            'ModelDataUrl.$': '$.TrainingJob.ModelArtifacts.S3ModelArtifacts',
            'Mode': 'SingleModel'
        }
      },
    });
});

test('create complex model', () => {
    // WHEN
    const vpc = new ec2.Vpc(stack, "VPC");

    const task = new sfn.Task(stack, 'Create Model', { task: new tasks.SagemakerCreateModelTask({
        modelName: 'MyModel',
        primaryContainer: {
          image: tasks.DockerImage.fromRegistry(sfn.Data.stringAt('$.TrainingJob.image_name')),
          mode: tasks.ModelContainerMode.SINGLEMODEL,
          modelDataUrl: sfn.Data.stringAt("$.TrainingJob.ModelArtifacts.S3ModelArtifacts")
        },
        enableNetworkIsolation: true,
        tags: {
           Project: "MyProject"
        },
        vpcConfig: {
            vpc
        }
      }),
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      Resource: {
        "Fn::Join": [
          "",
          [
            "arn:",
            {
              Ref: "AWS::Partition",
            },
            ":states:::sagemaker:createModel",
          ],
        ],
      },
      End: true,
      Parameters: {
        EnableNetworkIsolation: true,
        ExecutionRoleArn:  {
            "Fn::GetAtt":  ["CreateModelSagemakerRoleC2E07FC0", "Arn", ]
            },
        ModelName: 'MyModel',
        PrimaryContainer: {
            'Image.$': '$.TrainingJob.image_name',
            'ModelDataUrl.$': '$.TrainingJob.ModelArtifacts.S3ModelArtifacts',
            'Mode': 'SingleModel'
        },
        Tags: [
            {
                Key: 'Project',
                Value: 'MyProject'
            }
        ],
        VpcConfig: {
            SecurityGroupIds: [
                {
                    "Fn::GetAtt": ["CreateModelTrainJobSecurityGroupFE20CD55", "GroupId"]
                }
            ],
            Subnets: [
                {Ref: 'VPCPrivateSubnet1Subnet8BCA10E0'},
                {Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A'}
            ]
        },
      },
    });
});