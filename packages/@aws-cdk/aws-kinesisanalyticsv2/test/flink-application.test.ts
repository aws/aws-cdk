import { ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as core from '@aws-cdk/core';
import * as path from 'path';
import * as ka from '../lib';

function buildStack() {
  const stack = new core.Stack();
  const bucket = new s3.Bucket(stack, 'CodeBucket');
  const requiredProps = {
    runtime: ka.FlinkRuntime.FLINK_1_11,
    code: ka.ApplicationCode.fromBucket(bucket, 'my-app.jar'),
  };

  return { stack, bucket, requiredProps };
}

describe('FlinkApplication', () => {
  test('default Flink Application', () => {
    const { stack, bucket } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      runtime: ka.FlinkRuntime.FLINK_1_11,
      code: ka.ApplicationCode.fromBucket(bucket, 'my-app.jar'),
    });

    expect(stack).toHaveResource('AWS::KinesisAnalyticsV2::Application', {
      RuntimeEnvironment: 'FLINK-1_11',
      ServiceExecutionRole: {
        'Fn::GetAtt': [
          'FlinkApplicationRole2F7BCBF6',
          'Arn',
        ],
      },
      ApplicationConfiguration: {
        ApplicationCodeConfiguration: {
          CodeContent: {
            S3ContentLocation: {
              BucketARN: stack.resolve(bucket.bucketArn),
              FileKey: 'my-app.jar',
            },
          },
          CodeContentType: 'ZIPFILE',
        },
      },
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      DeletionPolicy: 'Delete',
    }, ResourcePart.CompleteDefinition);

    expect(stack).toHaveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'kinesisanalytics.amazonaws.com',
          },
        }],
        Version: '2012-10-17',
      },
    });
  });

  test('providing a custom role', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      role: new iam.Role(stack, 'CustomRole', {
        assumedBy: new iam.ServicePrincipal('custom-principal'),
      }),
    });

    expect(stack).toHaveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'custom-principal.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('addToPrincipalPolicy', () => {
    const { stack, requiredProps } = buildStack();
    const app = new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
    });

    app.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['custom:action'],
      resources: ['*'],
    }));

    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          { Action: 'custom:action', Effect: 'Allow', Resource: '*' },
        ],
      },
    });
  });

  test('providing a custom runtime', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      runtime: new ka.FlinkRuntime('custom'),
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      RuntimeEnvironment: 'custom',
    });
  });

  test('providing a custom removal policy', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      removalPolicy: core.RemovalPolicy.RETAIN,
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      DeletionPolicy: 'Retain',
    }, ResourcePart.CompleteDefinition);
  });

  test('granting permissions to resources', () => {
    const { stack, requiredProps } = buildStack();
    const app = new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
    });

    const dataBucket = new s3.Bucket(stack, 'DataBucket');
    dataBucket.grantRead(app);

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
          },
        ],
      },
    });
  });

  test('using an asset for code', () => {
    const { stack, requiredProps } = buildStack();
    const code = ka.ApplicationCode.fromAsset(path.join(__dirname, 'code-asset'));
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      code,
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      RuntimeEnvironment: 'FLINK-1_11',
      ApplicationConfiguration: {
        ApplicationCodeConfiguration: {
          CodeContent: {
            S3ContentLocation: {
              BucketARN: stack.resolve(code.asset!.bucket.bucketArn),
              FileKey: stack.resolve(code.asset!.s3ObjectKey),
            },
          },
          CodeContentType: 'ZIPFILE',
        },
      },
    });
  });

  test('adding property groups', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      propertyGroups: [
        new ka.PropertyGroup('FlinkApplicationProperties', {
          SomeProperty: 'SomeValue',
        }),
      ],
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      RuntimeEnvironment: 'FLINK-1_11',
      ApplicationConfiguration: {
        EnvironmentProperties: {
          PropertyGroups: [
            {
              PropertyGroupId: 'FlinkApplicationProperties',
              PropertyMap: {
                SomeProperty: 'SomeValue',
              },
            },
          ],
        },
      },
    });
  });

  test('checkpointEnabled setting', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      checkpointingEnabled: false,
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      RuntimeEnvironment: 'FLINK-1_11',
      ApplicationConfiguration: {
        FlinkApplicationConfiguration: {
          CheckpointConfiguration: {
            ConfigurationType: 'CUSTOM',
            CheckpointingEnabled: false,
          },
        },
      },
    });
  });

  // TODO: Not quite sure what to do with fromAttributes yet.
  test('fromAttributes', () => {
    const { stack } = buildStack();
    const flinkApp = ka.FlinkApplication.fromAttributes(stack, 'Imported', {
      applicationName: 'my-app',
      applicationArn: 'my-arn',
    });

    expect(flinkApp.applicationName).toEqual('my-app');
    expect(flinkApp.applicationArn).toEqual('my-arn');
    expect(flinkApp.addToPrincipalPolicy(new iam.PolicyStatement())).toBe(false);
  });
});
