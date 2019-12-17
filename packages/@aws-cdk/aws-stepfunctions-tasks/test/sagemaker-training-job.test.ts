import '@aws-cdk/assert/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

let stack: cdk.Stack;

beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
});

test('create basic training job', () => {
    // WHEN
    const task = new sfn.Task(stack, 'TrainSagemaker', { task: new tasks.SagemakerTrainTask({
        trainingJobName: "MyTrainJob",
        algorithmSpecification: {
            algorithmName: "BlazingText",
        },
        inputDataConfig: [
            {
                channelName: 'train',
                dataSource: {
                    s3DataSource: {
                        s3Location: tasks.S3Location.fromBucket(s3.Bucket.fromBucketName(stack, 'InputBucket', 'mybucket'), 'mytrainpath')
                    }
                }
            }
        ],
        outputDataConfig: {
            s3OutputLocation: tasks.S3Location.fromBucket(s3.Bucket.fromBucketName(stack, 'OutputBucket', 'mybucket'), 'myoutputpath')
        },
    })});

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
            ":states:::sagemaker:createTrainingJob",
          ],
        ],
      },
      End: true,
      Parameters: {
        AlgorithmSpecification: {
            AlgorithmName: 'BlazingText',
            TrainingInputMode: 'File',
        },
        InputDataConfig: [
            {
                ChannelName: 'train',
                DataSource: {
                    S3DataSource: {
                        S3DataType: 'S3Prefix',
                        S3Uri: {
                            'Fn::Join': ['', ['https://s3.', { Ref: 'AWS::Region'}, '.', { Ref: 'AWS::URLSuffix' }, '/mybucket/mytrainpath']]
                        }
                    }
                }
            }
        ],
        OutputDataConfig: {
            S3OutputPath: {
                'Fn::Join': ['', ['https://s3.', { Ref: 'AWS::Region' }, '.', { Ref: 'AWS::URLSuffix' }, '/mybucket/myoutputpath']]
            }
        },
        ResourceConfig: {
            InstanceCount: 1,
            InstanceType: 'ml.m4.xlarge',
            VolumeSizeInGB: 10
        },
        RoleArn: { "Fn::GetAtt": [ "TrainSagemakerSagemakerRole89E8C593", "Arn" ] },
        StoppingCondition: {
            MaxRuntimeInSeconds: 3600
        },
        TrainingJobName: 'MyTrainJob',
      },
    });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
    expect(() => {
        new sfn.Task(stack, 'TrainSagemaker', { task: new tasks.SagemakerTrainTask({
            integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
            trainingJobName: "MyTrainJob",
            algorithmSpecification: {
                algorithmName: "BlazingText",
            },
            inputDataConfig: [
                {
                    channelName: 'train',
                    dataSource: {
                        s3DataSource: {
                            s3Location: tasks.S3Location.fromBucket(s3.Bucket.fromBucketName(stack, 'InputBucket', 'mybucket'), 'mytrainpath')
                        }
                    }
                }
            ],
            outputDataConfig: {
                s3OutputLocation: tasks.S3Location.fromBucket(s3.Bucket.fromBucketName(stack, 'OutputBucket', 'mybucket'), 'myoutputpath')
            },
        })});
    }).toThrow(/Invalid Service Integration Pattern: WAIT_FOR_TASK_TOKEN is not supported to call SageMaker./i);
  });

test('create complex training job', () => {
    // WHEN
    const kmsKey = new kms.Key(stack, 'Key');
    const vpc = new ec2.Vpc(stack, "VPC");
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc, description: 'My SG' });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from the world');

    const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess')
        ],
    });

    const trainTask = new tasks.SagemakerTrainTask({
        trainingJobName: "MyTrainJob",
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
        role,
        algorithmSpecification: {
            algorithmName: "BlazingText",
            trainingInputMode: tasks.InputMode.FILE,
            metricDefinitions: [
                {
                    name: 'mymetric', regex: 'regex_pattern'
                }
            ]
        },
        hyperparameters: {
            lr: "0.1"
        },
        inputDataConfig: [
            {
                channelName: "train",
                contentType: "image/jpeg",
                compressionType: tasks.CompressionType.NONE,
                recordWrapperType: tasks.RecordWrapperType.RECORD_IO,
                dataSource: {
                    s3DataSource: {
                        s3DataType: tasks.S3DataType.S3_PREFIX,
                        s3Location: tasks.S3Location.fromBucket(s3.Bucket.fromBucketName(stack, 'InputBucketA', 'mybucket'), 'mytrainpath'),
                    }
                }
            },
            {
                channelName: "test",
                contentType: "image/jpeg",
                compressionType: tasks.CompressionType.GZIP,
                recordWrapperType: tasks.RecordWrapperType.RECORD_IO,
                dataSource: {
                    s3DataSource: {
                        s3DataType: tasks.S3DataType.S3_PREFIX,
                        s3Location: tasks.S3Location.fromBucket(s3.Bucket.fromBucketName(stack, 'InputBucketB', 'mybucket'), 'mytestpath'),
                    }
                }
            }
        ],
        outputDataConfig: {
            s3OutputLocation: tasks.S3Location.fromBucket(s3.Bucket.fromBucketName(stack, 'OutputBucket', 'mybucket'), 'myoutputpath'),
            encryptionKey: kmsKey
        },
        resourceConfig: {
            instanceCount: 1,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.P3, ec2.InstanceSize.XLARGE2),
            volumeSizeInGB: 50,
            volumeEncryptionKey: kmsKey,
        },
        stoppingCondition: {
            maxRuntime: cdk.Duration.hours(1)
        },
        tags: {
           Project: "MyProject"
        },
        vpcConfig: {
            vpc,
        }
    });
    trainTask.addSecurityGroup(securityGroup);
    const task = new sfn.Task(stack, 'TrainSagemaker', { task: trainTask });

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
            ":states:::sagemaker:createTrainingJob.sync",
          ],
        ],
      },
      End: true,
      Parameters: {
        TrainingJobName: 'MyTrainJob',
        RoleArn: { "Fn::GetAtt": [ "Role1ABCC5F0", "Arn" ] },
        AlgorithmSpecification: {
            TrainingInputMode: 'File',
            AlgorithmName: 'BlazingText',
            MetricDefinitions: [
                { Name: "mymetric", Regex: "regex_pattern" }
            ]
        },
        HyperParameters: {
            lr: "0.1"
        },
        InputDataConfig: [
            {
                ChannelName: 'train',
                CompressionType: 'None',
                RecordWrapperType: 'RecordIO',
                ContentType: 'image/jpeg',
                DataSource: {
                    S3DataSource: {
                        S3DataType: 'S3Prefix',
                        S3Uri: {
                            'Fn::Join': ['', ['https://s3.', { Ref: 'AWS::Region'}, '.', { Ref: 'AWS::URLSuffix' }, '/mybucket/mytrainpath']]
                        }
                    }
                }
            },
            {
                ChannelName: 'test',
                CompressionType: 'Gzip',
                RecordWrapperType: 'RecordIO',
                ContentType: 'image/jpeg',
                DataSource: {
                    S3DataSource: {
                        S3DataType: 'S3Prefix',
                        S3Uri: {
                            'Fn::Join': ['', ['https://s3.', { Ref: 'AWS::Region'}, '.', { Ref: 'AWS::URLSuffix' }, '/mybucket/mytestpath']]
                        }
                    }
                }
            }
        ],
        OutputDataConfig: {
            S3OutputPath: {
                'Fn::Join': ['', ['https://s3.', { Ref: 'AWS::Region' }, '.', { Ref: 'AWS::URLSuffix' }, '/mybucket/myoutputpath']]
            },
            KmsKeyId: { "Fn::GetAtt": [ "Key961B73FD", "Arn" ] },
        },
        ResourceConfig: {
            InstanceCount: 1,
            InstanceType: 'ml.p3.2xlarge',
            VolumeSizeInGB: 50,
            VolumeKmsKeyId: { "Fn::GetAtt": [ "Key961B73FD", "Arn" ] },
        },
        StoppingCondition: {
            MaxRuntimeInSeconds: 3600
        },
        Tags: [
            { Key: "Project", Value: "MyProject" }
        ],
        VpcConfig: {
            SecurityGroupIds: [
                { "Fn::GetAtt": [ "SecurityGroupDD263621", "GroupId" ] },
                { "Fn::GetAtt": [ "TrainSagemakerTrainJobSecurityGroup7C858EB9", "GroupId" ] },
            ],
            Subnets: [
                { Ref: "VPCPrivateSubnet1Subnet8BCA10E0" },
                { Ref: "VPCPrivateSubnet2SubnetCFCDAA7A" },
            ]
        }
      },
    });
});

test('pass param to training job', () => {
    // WHEN
    const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'),
        ],
    });

    const task = new sfn.Task(stack, 'TrainSagemaker', { task: new tasks.SagemakerTrainTask({
        trainingJobName: sfn.Data.stringAt('$.JobName'),
        role,
        algorithmSpecification: {
            algorithmName: "BlazingText",
            trainingInputMode: tasks.InputMode.FILE
        },
        inputDataConfig: [
            {
                channelName: 'train',
                dataSource: {
                    s3DataSource: {
                        s3DataType: tasks.S3DataType.S3_PREFIX,
                        s3Location: tasks.S3Location.fromJsonExpression('$.S3Bucket')
                    }
                }
            }
        ],
        outputDataConfig: {
            s3OutputLocation: tasks.S3Location.fromBucket(s3.Bucket.fromBucketName(stack, 'Bucket', 'mybucket'), 'myoutputpath'),
        },
        resourceConfig: {
            instanceCount: 1,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.P3, ec2.InstanceSize.XLARGE2),
            volumeSizeInGB: 50
        },
        stoppingCondition: {
            maxRuntime: cdk.Duration.hours(1)
        }
    })});

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
            ":states:::sagemaker:createTrainingJob",
          ],
        ],
      },
      End: true,
      Parameters: {
        'TrainingJobName.$': '$.JobName',
        'RoleArn': { "Fn::GetAtt": [ "Role1ABCC5F0", "Arn" ] },
        'AlgorithmSpecification': {
            TrainingInputMode: 'File',
            AlgorithmName: 'BlazingText',
        },
        'InputDataConfig': [
            {
                ChannelName: 'train',
                DataSource: {
                    S3DataSource: {
                        'S3DataType': 'S3Prefix',
                        'S3Uri.$': '$.S3Bucket'
                    }
                }
            }
        ],
        'OutputDataConfig': {
            S3OutputPath: {
                'Fn::Join': ['', ['https://s3.', { Ref: 'AWS::Region' }, '.', { Ref: 'AWS::URLSuffix' }, '/mybucket/myoutputpath']]
            }
        },
        'ResourceConfig': {
            InstanceCount: 1,
            InstanceType: 'ml.p3.2xlarge',
            VolumeSizeInGB: 50
        },
        'StoppingCondition': {
            MaxRuntimeInSeconds: 3600
        }
      },
    });
});

test('Cannot create a SageMaker train task with both algorithm name and image name missing', () => {

    expect(() => new tasks.SagemakerTrainTask({
        trainingJobName: 'myTrainJob',
        algorithmSpecification: {},
        inputDataConfig: [
            {
                channelName: 'train',
                dataSource: {
                    s3DataSource: {
                        s3DataType: tasks.S3DataType.S3_PREFIX,
                        s3Location: tasks.S3Location.fromJsonExpression('$.S3Bucket')
                    }
                }
            }
        ],
        outputDataConfig: {
            s3OutputLocation: tasks.S3Location.fromBucket(s3.Bucket.fromBucketName(stack, 'Bucket', 'mybucket'), 'myoutputpath/')
        },
    }))
      .toThrowError(/Must define either an algorithm name or training image URI in the algorithm specification/);
});
