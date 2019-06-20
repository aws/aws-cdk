import '@aws-cdk/assert/jest';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import tasks = require('../lib');

let stack: cdk.Stack;

beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
  });

test('create basic training job', () => {
    // WHEN
    const task = new sfn.Task(stack, 'TrainSagemaker', { task: new tasks.SagemakerTrainTask(stack, {
        trainingJobName: "MyTrainJob",
        algorithmSpecification: {
            algorithmName: "BlazingText",
        },
        inputDataConfig: [
            {
                channelName: 'train',
                dataSource: {
                    s3DataSource: {
                        s3Uri: "s3://mybucket/mytrainpath"
                    }
                }
            }
        ],
        outputDataConfig: {
            s3OutputPath: 's3://mybucket/myoutputpath'
        },
    })});

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      Resource: 'arn:aws:states:::sagemaker:createTrainingJob',
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
                        S3Uri: 's3://mybucket/mytrainpath'
                    }
                }
            }
        ],
        OutputDataConfig: {
            S3OutputPath: 's3://mybucket/myoutputpath'
        },
        ResourceConfig: {
            InstanceCount: 1,
            InstanceType: 'ml.m4.xlarge',
            VolumeSizeInGB: 10
        },
        RoleArn: { "Fn::GetAtt": [ "SagemakerRole5FDB64E1", "Arn" ] },
        StoppingCondition: {
            MaxRuntimeInSeconds: 3600
        },
        TrainingJobName: 'MyTrainJob',
      },
    });
});

test('create complex training job', () => {
    // WHEN
    const kmsKey = new kms.Key(stack, 'Key');
    const vpc = new ec2.Vpc(stack, "VPC");
    const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc, description: 'My SG' });
    securityGroup.addIngressRule(new ec2.AnyIPv4(), new ec2.TcpPort(22), 'allow ssh access from the world');

    const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess')
        ],
    });

    const task = new sfn.Task(stack, 'TrainSagemaker', { task: new tasks.SagemakerTrainTask(stack, {
        trainingJobName: "MyTrainJob",
        synchronous: true,
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
                        s3Uri: "s3://mybucket/mytrainpath",
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
                        s3Uri: "s3://mybucket/mytestpath",
                    }
                }
            }
        ],
        outputDataConfig: {
            s3OutputPath: 's3://mybucket/myoutputpath',
            encryptionKey: kmsKey
        },
        resourceConfig: {
            instanceCount: 1,
            instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.P3, ec2.InstanceSize.XLARGE2),
            volumeSizeInGB: 50,
            volumeKmsKeyId: kmsKey,
        },
        stoppingCondition: {
            maxRuntimeInSeconds: 3600
        },
        tags: {
           Project: "MyProject"
        },
        vpcConfig: {
            vpc,
            subnets: vpc.privateSubnets,
            securityGroups: [ securityGroup ]
        }
    })});

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      Resource: 'arn:aws:states:::sagemaker:createTrainingJob.sync',
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
                        S3Uri: 's3://mybucket/mytrainpath'
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
                        S3Uri: 's3://mybucket/mytestpath'
                    }
                }
            }
        ],
        OutputDataConfig: {
            S3OutputPath: 's3://mybucket/myoutputpath',
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
            SecurityGroupIds: [ { "Fn::GetAtt": [ "SecurityGroupDD263621", "GroupId" ] } ],
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

    const task = new sfn.Task(stack, 'TrainSagemaker', { task: new tasks.SagemakerTrainTask(stack, {
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
                        s3Uri: sfn.Data.stringAt('$.S3Bucket')
                    }
                }
            }
        ],
        outputDataConfig: {
            s3OutputPath: 's3://mybucket/myoutputpath'
        },
        resourceConfig: {
            instanceCount: 1,
            instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.P3, ec2.InstanceSize.XLARGE2),
            volumeSizeInGB: 50
        },
        stoppingCondition: {
            maxRuntimeInSeconds: 3600
        }
    })});

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      Resource: 'arn:aws:states:::sagemaker:createTrainingJob',
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
            S3OutputPath: 's3://mybucket/myoutputpath'
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