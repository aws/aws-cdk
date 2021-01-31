import { arrayWith, objectLike, ResourcePart } from '@aws-cdk/assert';
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
        ApplicationSnapshotConfiguration: {
          SnapshotsEnabled: true,
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

    app.addToRolePolicy(new iam.PolicyStatement({
      actions: ['custom:action'],
      resources: ['*'],
    }));

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: arrayWith(
          objectLike({ Action: 'custom:action', Effect: 'Allow', Resource: '*' }),
        ),
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
        Statement: arrayWith(
          objectLike({ Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'] }),
        ),
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

  test('checkpointInterval setting', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      checkpointInterval: core.Duration.minutes(5),
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      ApplicationConfiguration: {
        FlinkApplicationConfiguration: {
          CheckpointConfiguration: {
            ConfigurationType: 'CUSTOM',
            CheckpointInterval: 300_000,
          },
        },
      },
    });
  });

  test('minPauseBetweenCheckpoints setting', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      minPauseBetweenCheckpoints: core.Duration.seconds(10),
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      ApplicationConfiguration: {
        FlinkApplicationConfiguration: {
          CheckpointConfiguration: {
            ConfigurationType: 'CUSTOM',
            MinPauseBetweenCheckpoints: 10_000,
          },
        },
      },
    });
  });

  test('logLevel setting', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      logLevel: ka.FlinkLogLevel.DEBUG,
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      ApplicationConfiguration: {
        FlinkApplicationConfiguration: {
          MonitoringConfiguration: {
            ConfigurationType: 'CUSTOM',
            LogLevel: 'DEBUG',
          },
        },
      },
    });
  });

  test('metricsLevel setting', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      metricsLevel: ka.FlinkMetricsLevel.PARALLELISM,
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      ApplicationConfiguration: {
        FlinkApplicationConfiguration: {
          MonitoringConfiguration: {
            ConfigurationType: 'CUSTOM',
            MetricsLevel: 'PARALLELISM',
          },
        },
      },
    });
  });

  test('autoscalingEnabled setting', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      autoScalingEnabled: false,
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      ApplicationConfiguration: {
        FlinkApplicationConfiguration: {
          ParallelismConfiguration: {
            ConfigurationType: 'CUSTOM',
            AutoScalingEnabled: false,
          },
        },
      },
    });
  });

  test('parallelism setting', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      parallelism: 2,
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      ApplicationConfiguration: {
        FlinkApplicationConfiguration: {
          ParallelismConfiguration: {
            ConfigurationType: 'CUSTOM',
            Parallelism: 2,
          },
        },
      },
    });
  });

  test('parallelismPerKpu setting', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      parallelismPerKpu: 2,
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      ApplicationConfiguration: {
        FlinkApplicationConfiguration: {
          ParallelismConfiguration: {
            ConfigurationType: 'CUSTOM',
            ParallelismPerKPU: 2,
          },
        },
      },
    });
  });

  test('snapshotsEnabled setting', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      snapshotsEnabled: false,
    });

    expect(stack).toHaveResourceLike('AWS::KinesisAnalyticsV2::Application', {
      ApplicationConfiguration: {
        ApplicationSnapshotConfiguration: {
          SnapshotsEnabled: false,
        },
      },
    });
  });

  // TODO: Put all logging options on FlinkApplication, new ka.Logging or something else?
  test('default logging option', () => {
    const { stack, requiredProps } = buildStack();
    new ka.FlinkApplication(stack, 'FlinkApplication', {
      ...requiredProps,
      snapshotsEnabled: false,
    });

    expect(stack).toHaveResource('AWS::KinesisAnalyticsV2::ApplicationCloudWatchLoggingOption', {
      ApplicationName: {
        Ref: 'FlinkApplicationC5836815',
      },
      CloudWatchLoggingOption: {
        LogStreamARN: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':logs:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':log-group:',
              {
                Ref: 'FlinkApplicationLogGroup7739479C',
              },
              ':log-stream:',
              {
                Ref: 'FlinkApplicationLogStreamB633AF32',
              },
            ],
          ],
        },
      },
    });

    expect(stack).toHaveResource('AWS::Logs::LogGroup', {
      Properties: {
        RetentionInDays: 7,
      },
      UpdateReplacePolicy: 'Delete',
      DeletionPolicy: 'Delete',
    }, ResourcePart.CompleteDefinition);
  });

  test('validating applicationName', () => {
    const { stack, requiredProps } = buildStack();

    // Expect no error with valid name
    new ka.FlinkApplication(stack, 'ValidString', {
      ...requiredProps,
      applicationName: 'my-VALID.app_name',
    });

    // Expect no error with ref
    new ka.FlinkApplication(stack, 'ValidRef', {
      ...requiredProps,
      applicationName: new core.CfnParameter(stack, 'Parameter').valueAsString,
    });

    expect(() => {
      new ka.FlinkApplication(stack, 'Empty', {
        ...requiredProps,
        applicationName: '',
      });
    }).toThrow(/cannot be empty/);

    expect(() => {
      new ka.FlinkApplication(stack, 'InvalidCharacters', {
        ...requiredProps,
        applicationName: '!!!',
      });
    }).toThrow(/may only contain letters, numbers, underscores, hyphens, and periods/);

    expect(() => {
      new ka.FlinkApplication(stack, 'TooLong', {
        ...requiredProps,
        applicationName: 'a'.repeat(129),
      });
    }).toThrow(/max length is 128/);
  });

  test('validating parallelism', () => {
    const { stack, requiredProps } = buildStack();

    // Expect no error with valid value
    new ka.FlinkApplication(stack, 'ValidNumber', {
      ...requiredProps,
      parallelism: 32,
    });

    // Expect no error with ref
    new ka.FlinkApplication(stack, 'ValidRef', {
      ...requiredProps,
      parallelism: new core.CfnParameter(stack, 'Parameter', {
        type: 'Number',
      }).valueAsNumber,
    });

    expect(() => {
      new ka.FlinkApplication(stack, 'TooSmall', {
        ...requiredProps,
        parallelism: 0,
      });
    }).toThrow(/must be at least 1/);
  });

  test('validating parallelismPerKpu', () => {
    const { stack, requiredProps } = buildStack();

    // Expect no error with valid value
    new ka.FlinkApplication(stack, 'ValidNumber', {
      ...requiredProps,
      parallelismPerKpu: 10,
    });

    // Expect no error with ref
    new ka.FlinkApplication(stack, 'ValidRef', {
      ...requiredProps,
      parallelismPerKpu: new core.CfnParameter(stack, 'Parameter', {
        type: 'Number',
      }).valueAsNumber,
    });

    expect(() => {
      new ka.FlinkApplication(stack, 'TooSmall', {
        ...requiredProps,
        parallelismPerKpu: 0,
      });
    }).toThrow(/must be at least 1/);
  });

  test('fromFlinkApplicationName', () => {
    const { stack } = buildStack();
    const flinkApp = ka.FlinkApplication.fromFlinkApplicationName(stack, 'Imported', 'my-app');

    expect(flinkApp.applicationName).toEqual('my-app');
    expect(stack.resolve(flinkApp.applicationArn)).toEqual({
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':kinesisanalytics:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':application/my-app',
      ]],
    });
    expect(flinkApp.addToRolePolicy(new iam.PolicyStatement())).toBe(false);
  });

  test('fromFlinkApplicationArn', () => {
    const { stack } = buildStack();
    const arn = 'arn:aws:kinesisanalytics:us-west-2:012345678901:application/my-app';
    const flinkApp = ka.FlinkApplication.fromFlinkApplicationArn(stack, 'Imported', arn);

    expect(flinkApp.applicationName).toEqual('my-app');
    expect(flinkApp.applicationArn).toEqual(arn);
    expect(flinkApp.addToRolePolicy(new iam.PolicyStatement())).toBe(false);
  });
});
