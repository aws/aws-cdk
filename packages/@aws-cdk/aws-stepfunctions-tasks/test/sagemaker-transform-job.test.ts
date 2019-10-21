import '@aws-cdk/assert/jest';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/core');
import tasks = require('../lib');
import { BatchStrategy, S3DataType } from '../lib';

let stack: cdk.Stack;
let role: iam.Role;

beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
    role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess')
        ],
    });
});

test('create basic transform job', () => {
    // WHEN
    const task = new sfn.Task(stack, 'TransformTask', { task: new tasks.SagemakerTransformTask({
        transformJobName: "MyTransformJob",
        modelName: "MyModelName",
        transformInput: {
            transformDataSource: {
                s3DataSource: {
                    s3Uri: 's3://inputbucket/prefix',
                }
            }
        },
        transformOutput: {
            s3OutputPath: 's3://outputbucket/prefix',
        },
    }) });

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
            ":states:::sagemaker:createTransformJob",
          ],
        ],
      },
      End: true,
      Parameters: {
        TransformJobName: 'MyTransformJob',
        ModelName: 'MyModelName',
        TransformInput: {
            DataSource: {
                S3DataSource: {
                    S3Uri: 's3://inputbucket/prefix',
                    S3DataType: 'S3Prefix',
                }
            }
        },
        TransformOutput: {
            S3OutputPath: 's3://outputbucket/prefix',
        },
        TransformResources: {
            InstanceCount: 1,
            InstanceType: 'ml.m4.xlarge',
        }
      },
    });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
    expect(() => {
        new sfn.Task(stack, 'TransformTask', { task: new tasks.SagemakerTransformTask({
            integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
            transformJobName: "MyTransformJob",
            modelName: "MyModelName",
            transformInput: {
                transformDataSource: {
                    s3DataSource: {
                        s3Uri: 's3://inputbucket/prefix',
                    }
                }
            },
            transformOutput: {
                s3OutputPath: 's3://outputbucket/prefix',
            },
        }) });
    }).toThrow(/Invalid Service Integration Pattern: WAIT_FOR_TASK_TOKEN is not supported to call SageMaker./i);
  });

test('create complex transform job', () => {
    // WHEN
    const kmsKey = new kms.Key(stack, 'Key');
    const task = new sfn.Task(stack, 'TransformTask', { task: new tasks.SagemakerTransformTask({
        transformJobName: "MyTransformJob",
        modelName: "MyModelName",
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
        role,
        transformInput: {
            transformDataSource: {
                s3DataSource: {
                    s3Uri: 's3://inputbucket/prefix',
                    s3DataType: S3DataType.S3_PREFIX,
                }
            }
        },
        transformOutput: {
            s3OutputPath: 's3://outputbucket/prefix',
            encryptionKey: kmsKey,
        },
        transformResources: {
            instanceCount: 1,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.P3, ec2.InstanceSize.XLARGE2),
            volumeKmsKeyId: kmsKey,
        },
        tags: {
            Project: 'MyProject',
        },
        batchStrategy: BatchStrategy.MULTI_RECORD,
        environment: {
            SOMEVAR: 'myvalue'
        },
        maxConcurrentTransforms: 3,
        maxPayloadInMB: 100,
    }) });

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
            ":states:::sagemaker:createTransformJob.sync",
          ],
        ],
      },
      End: true,
      Parameters: {
        TransformJobName: 'MyTransformJob',
        ModelName: 'MyModelName',
        TransformInput: {
            DataSource: {
                S3DataSource: {
                    S3Uri: 's3://inputbucket/prefix',
                    S3DataType: 'S3Prefix',
                }
            }
        },
        TransformOutput: {
            S3OutputPath: 's3://outputbucket/prefix',
            KmsKeyId: { "Fn::GetAtt": [ "Key961B73FD", "Arn" ] },
        },
        TransformResources: {
            InstanceCount: 1,
            InstanceType: 'ml.p3.2xlarge',
            VolumeKmsKeyId: { "Fn::GetAtt": [ "Key961B73FD", "Arn" ] },
        },
        Tags: [
            { Key: 'Project', Value: 'MyProject' }
        ],
        MaxConcurrentTransforms: 3,
        MaxPayloadInMB: 100,
        Environment: {
            SOMEVAR: 'myvalue'
        },
        BatchStrategy: 'MultiRecord'
      },
    });
});

test('pass param to transform job', () => {
    // WHEN
    const task = new sfn.Task(stack, 'TransformTask', { task: new tasks.SagemakerTransformTask({
        transformJobName: sfn.Data.stringAt('$.TransformJobName'),
        modelName: sfn.Data.stringAt('$.ModelName'),
        role,
        transformInput: {
            transformDataSource: {
                s3DataSource: {
                    s3Uri: 's3://inputbucket/prefix',
                    s3DataType: S3DataType.S3_PREFIX,
                }
            }
        },
        transformOutput: {
            s3OutputPath: 's3://outputbucket/prefix',
        },
        transformResources: {
            instanceCount: 1,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.P3, ec2.InstanceSize.XLARGE2),
        }
    }) });

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
                ":states:::sagemaker:createTransformJob",
              ],
            ],
        },
        End: true,
        Parameters: {
          'TransformJobName.$': '$.TransformJobName',
          'ModelName.$': '$.ModelName',
          'TransformInput': {
              DataSource: {
                  S3DataSource: {
                      S3Uri: 's3://inputbucket/prefix',
                      S3DataType: 'S3Prefix',
                  }
              }
          },
          'TransformOutput': {
              S3OutputPath: 's3://outputbucket/prefix',
          },
          'TransformResources': {
              InstanceCount: 1,
              InstanceType: 'ml.p3.2xlarge',
          }
        },
      });
});
