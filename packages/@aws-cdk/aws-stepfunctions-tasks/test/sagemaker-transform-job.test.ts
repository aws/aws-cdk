import '@aws-cdk/assert/jest';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import tasks = require('../lib');
import { S3DataType, BatchStrategy } from '../lib';

let stack: cdk.Stack;
let role: iam.Role;

beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
    role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
        managedPolicyArns: [
            new iam.AwsManagedPolicy('AmazonSageMakerFullAccess', stack).policyArn
        ],
    });
  });

test('create basic transform job', () => {
    // WHEN
    const params = new tasks.TransformJobParameters("MyTransformJob", "MyModelName", role);
    params.addTransformInput(
            {
                transformDataSource: {
                    s3DataSource: {
                        s3Uri: 's3://inputbucket/prefix',
                        s3DataType: S3DataType.S3Prefix,
                    }
                }
            })
            .addTransformOutput({
                    s3OutputPath: 's3://outputbucket/prefix',
            })
            .addTransformResources({
                instanceCount: 1,
                instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.P3, ec2.InstanceSize.XLarge2),
            });

    const pub = new sfn.Task(stack, 'TransformTask', { task: new tasks.SagemakerTransformJobTask(params) });

    // THEN
    expect(stack.node.resolve(pub.toStateJson())).toEqual({
      Type: 'Task',
      Resource: 'arn:aws:states:::sagemaker:createTransformJob',
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
            InstanceType: 'ml.p3.2xlarge',
        }
      },
    });
});

test('create complex transform job', () => {
    // WHEN
    const kmsKey = new kms.Key(stack, 'Key');
    const params = new tasks.TransformJobParameters("MyTransformJob", "MyModelName", role);
    params.addTransformInput(
            {
                transformDataSource: {
                    s3DataSource: {
                        s3Uri: 's3://inputbucket/prefix',
                        s3DataType: S3DataType.S3Prefix,
                    }
                }
            })
            .addTransformOutput({
                    s3OutputPath: 's3://outputbucket/prefix',
                    encryptionKey: kmsKey,
            })
            .addTransformResources({
                instanceCount: 1,
                instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.P3, ec2.InstanceSize.XLarge2),
                volumeKmsKeyId: kmsKey,
            })
            .addTag('Project', 'MyProject')
            .addBatchStrategy(BatchStrategy.MultiRecord)
            .addEnvironmentVar('SOMEVAR', 'myvalue')
            .addMaxConcurrentTransforms(3)
            .addMxaxPayloadInMB(100);

    const pub = new sfn.Task(stack, 'TransformTask', { task: new tasks.SagemakerTransformJobTask(params, true) });

    // THEN
    expect(stack.node.resolve(pub.toStateJson())).toEqual({
      Type: 'Task',
      Resource: 'arn:aws:states:::sagemaker:createTransformJob.sync',
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
    const params = new tasks.TransformJobParameters(sfn.Data.stringAt('$.TransformJobName'), sfn.Data.stringAt('$.ModelName'), role);
    params.addTransformInput(
        {
            transformDataSource: {
                s3DataSource: {
                    s3Uri: 's3://inputbucket/prefix',
                    s3DataType: S3DataType.S3Prefix,
                }
            }
        })
        .addTransformOutput({
                s3OutputPath: 's3://outputbucket/prefix',
        })
        .addTransformResources({
            instanceCount: 1,
            instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.P3, ec2.InstanceSize.XLarge2),
        });

    const pub = new sfn.Task(stack, 'TransformTask', { task: new tasks.SagemakerTransformJobTask(params) });

    // THEN
    expect(stack.node.resolve(pub.toStateJson())).toEqual({
        Type: 'Task',
        Resource: 'arn:aws:states:::sagemaker:createTransformJob',
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

test('throw error when mandatory parameter not found', () => {
    // WHEN
    const params = new tasks.TransformJobParameters("MyTransformJob", "MyModelName", role);

    // THEN
    expect(() => params.toJson()).toThrow();
});