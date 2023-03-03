import * as path from 'path';
import { Match, Template } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as core from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as flink from '../lib';

describe('Application', () => {
  let stack: core.Stack;
  let bucket: s3.Bucket;
  let requiredProps: {
    runtime: flink.Runtime;
    code: flink.ApplicationCode;
  };

  beforeEach(() => {
    stack = new core.Stack();
    bucket = new s3.Bucket(stack, 'CodeBucket');
    requiredProps = {
      runtime: flink.Runtime.FLINK_1_11,
      code: flink.ApplicationCode.fromBucket(bucket, 'my-app.jar'),
    };
  });

  test('default Flink Application', () => {
    new flink.Application(stack, 'FlinkApplication', {
      runtime: flink.Runtime.FLINK_1_11,
      code: flink.ApplicationCode.fromBucket(bucket, 'my-app.jar'),
      applicationName: 'MyFlinkApplication',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::Application', {
      ApplicationName: 'MyFlinkApplication',
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

    Template.fromStack(stack).hasResource('AWS::KinesisAnalyticsV2::Application', {
      DeletionPolicy: 'Delete',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayEquals([
          { Action: 'cloudwatch:PutMetricData', Effect: 'Allow', Resource: '*' },
          // Access to read from the code bucket
          {
            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
            Effect: 'Allow',
            Resource: Match.anyValue(),
          },
          {
            Action: 'logs:DescribeLogGroups',
            Effect: 'Allow',
            Resource: {
              // looks like arn:aws:logs:us-east-1:123456789012:log-group:*,
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':logs:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':log-group:*',
              ]],
            },
          },
          {
            Action: 'logs:DescribeLogStreams',
            Effect: 'Allow',
            Resource: {
              // looks like: arn:aws:logs:us-east-1:123456789012:log-group:my-log-group:*,
              'Fn::GetAtt': ['FlinkApplicationLogGroup7739479C', 'Arn'],
            },
          },
          {
            Action: 'logs:PutLogEvents',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':logs:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':log-group:',
                { Ref: 'FlinkApplicationLogGroup7739479C' },
                ':log-stream:',
                { Ref: 'FlinkApplicationLogStreamB633AF32' },
              ]],
            },
          },
        ]),
      },
    });
  });

  test('providing a custom role', () => {
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      role: new iam.Role(stack, 'CustomRole', {
        assumedBy: new iam.ServicePrincipal('custom-principal'),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
    const app = new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
    });

    app.addToRolePolicy(new iam.PolicyStatement({
      actions: ['custom:action'],
      resources: ['*'],
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({ Action: 'custom:action', Effect: 'Allow', Resource: '*' }),
        ]),
      },
    });
  });

  test('providing a custom runtime', () => {
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      runtime: flink.Runtime.of('custom'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::Application', {
      RuntimeEnvironment: 'custom',
    });
  });

  test('providing a custom removal policy', () => {
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      removalPolicy: core.RemovalPolicy.RETAIN,
    });

    Template.fromStack(stack).hasResource('AWS::KinesisAnalyticsV2::Application', {
      DeletionPolicy: 'Retain',
    });
  });

  test('granting permissions to resources', () => {
    const app = new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
    });

    const dataBucket = new s3.Bucket(stack, 'DataBucket');
    dataBucket.grantRead(app);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: Match.arrayWith([
          Match.objectLike({ Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'] }),
        ]),
      },
    });
  });

  test('using an asset for code', () => {
    const app = new core.App({
      context: {
        [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
      },
    });
    stack = new core.Stack(app);

    const code = flink.ApplicationCode.fromAsset(path.join(__dirname, 'code-asset'));
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      code,
    });
    const assetRef = 'AssetParameters8be9e0b5f53d41e9a3b1d51c9572c65f24f8170a7188d0ed57fb7d571de4d577S3BucketEBA17A67';
    const versionKeyRef = 'AssetParameters8be9e0b5f53d41e9a3b1d51c9572c65f24f8170a7188d0ed57fb7d571de4d577S3VersionKey5922697E';

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::Application', {
      ApplicationConfiguration: {
        ApplicationCodeConfiguration: {
          CodeContent: {
            S3ContentLocation: {
              BucketARN: {
                'Fn::Join': ['', [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':s3:::',
                  { Ref: assetRef },
                ]],
              },
              FileKey: {
                'Fn::Join': ['', [
                  { 'Fn::Select': [0, { 'Fn::Split': ['||', { Ref: versionKeyRef }] }] },
                  { 'Fn::Select': [1, { 'Fn::Split': ['||', { Ref: versionKeyRef }] }] },
                ]],
              },
            },
          },
          CodeContentType: 'ZIPFILE',
        },
      },
    });
  });

  test('adding property groups', () => {
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      propertyGroups: {
        FlinkApplicationProperties: {
          SomeProperty: 'SomeValue',
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::Application', {
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
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      checkpointingEnabled: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::Application', {
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
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      checkpointInterval: core.Duration.minutes(5),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::Application', {
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
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      minPauseBetweenCheckpoints: core.Duration.seconds(10),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::Application', {
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
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      logLevel: flink.LogLevel.DEBUG,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::Application', {
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
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      metricsLevel: flink.MetricsLevel.PARALLELISM,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::Application', {
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
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      autoScalingEnabled: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::Application', {
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
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      parallelism: 2,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::Application', {
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
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      parallelismPerKpu: 2,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::Application', {
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
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      snapshotsEnabled: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::Application', {
      ApplicationConfiguration: {
        ApplicationSnapshotConfiguration: {
          SnapshotsEnabled: false,
        },
      },
    });
  });

  test('default logging option', () => {
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      snapshotsEnabled: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisAnalyticsV2::ApplicationCloudWatchLoggingOption', {
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

    Template.fromStack(stack).hasResource('AWS::Logs::LogGroup', {
      Properties: {
        RetentionInDays: 731,
      },
      UpdateReplacePolicy: 'Retain',
      DeletionPolicy: 'Retain',
    });

    Template.fromStack(stack).hasResource('AWS::Logs::LogStream', {
      UpdateReplacePolicy: 'Retain',
      DeletionPolicy: 'Retain',
    });
  });

  test('logGroup setting', () => {
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      logGroup: new logs.LogGroup(stack, 'LogGroup', {
        logGroupName: 'custom',
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: 'custom',
    });
  });

  test('using a VPC with default vpcSubnets and securityGroups', () => {
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      vpc: new ec2.Vpc(stack, 'VPC'),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties(
      'AWS::KinesisAnalyticsV2::Application',
      {
        ApplicationConfiguration: {
          VpcConfigurations: [
            {
              SecurityGroupIds: [
                {
                  'Fn::GetAtt': ['FlinkApplicationSecurityGroup1FD816EE', 'GroupId'],
                },
              ],
              SubnetIds: [
                {
                  Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
                },
                {
                  Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
                },
              ],
            },
          ],
        },
      },
    );

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          {
            Action: [
              'ec2:DescribeVpcs',
              'ec2:DescribeSubnets',
              'ec2:DescribeSecurityGroups',
              'ec2:DescribeDhcpOptions',
              'ec2:CreateNetworkInterface',
              'ec2:CreateNetworkInterfacePermission',
              'ec2:DescribeNetworkInterfaces',
              'ec2:DeleteNetworkInterface',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ]),
      },
    });
  });

  test('providing securityGroups', () => {
    const vpc = new ec2.Vpc(stack, 'VPC');
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      vpc,
      securityGroups: [
        new ec2.SecurityGroup(stack, 'ProvidedSecurityGroup', { vpc }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties(
      'AWS::KinesisAnalyticsV2::Application',
      {
        ApplicationConfiguration: {
          VpcConfigurations: [
            {
              SecurityGroupIds: [
                {
                  'Fn::GetAtt': ['ProvidedSecurityGroup3C7655DD', 'GroupId'],
                },
              ],
            },
          ],
        },
      },
    );
  });

  test('providing a subnetSelection', () => {
    new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      vpc: new ec2.Vpc(stack, 'VPC'),
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    Template.fromStack(stack).hasResourceProperties(
      'AWS::KinesisAnalyticsV2::Application',
      {
        ApplicationConfiguration: {
          VpcConfigurations: [
            {
              SubnetIds: [
                {
                  Ref: 'VPCPublicSubnet1SubnetB4246D30',
                },
                {
                  Ref: 'VPCPublicSubnet2Subnet74179F39',
                },
              ],
            },
          ],
        },
      },
    );
  });

  test('using connections on a created Application', () => {
    const app = new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
      vpc: new ec2.Vpc(stack, 'VPC'),
    });

    app.connections.allowFromAnyIpv4(ec2.Port.tcp(443));

    Template.fromStack(stack).hasResourceProperties(
      'AWS::EC2::SecurityGroup',
      {
        SecurityGroupEgress: [{
          Description: 'Allow all outbound traffic by default',
          IpProtocol: '-1',
        }],
        SecurityGroupIngress: [{
          Description: 'from 0.0.0.0/0:443',
          FromPort: 443,
          IpProtocol: 'tcp',
          ToPort: 443,
        }],
      },
    );
  });

  test('using connections on an imported Application', () => {
    const app = flink.Application.fromApplicationAttributes(stack, 'FlinkApplication', {
      applicationArn: 'arn:aws:kinesisanalytics:us-west-2:012345678901:application/my-app',
      securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(stack, 'ImportedSG', 'sg-123456789')],
    });

    app.connections.allowFromAnyIpv4(ec2.Port.tcp(443));

    Template.fromStack(stack).hasResourceProperties(
      'AWS::EC2::SecurityGroupIngress',
      {
        FromPort: 443,
        GroupId: 'sg-123456789',
        IpProtocol: 'tcp',
        ToPort: 443,
      },
    );
  });

  test('validating vpnSubnets prop requires vpc prop', () => {
    expect(() => {
      new flink.Application(stack, 'FlinkApplication', {
        ...requiredProps,
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      });
    }).toThrow(/vpc prop required when passing vpcSubnets/);
  });

  test('validating securityGroups prop requires vpc prop', () => {
    expect(() => {
      const vpc = new ec2.Vpc(stack, 'VPC');
      const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', {
        vpc,
      });
      new flink.Application(stack, 'Error', {
        ...requiredProps,
        securityGroups: [securityGroup],
      });
    }).toThrow(/vpc prop required when passing securityGroups/);

    // empty array for securityGroups is treated the same as undefined
    expect(() => {
      new flink.Application(stack, 'OK', {
        ...requiredProps,
        securityGroups: [],
      });
    }).not.toThrow();
  });

  test('validating vpc provided when using connections for created App', () => {
    let app = new flink.Application(stack, 'FlinkApplication', {
      ...requiredProps,
    });
    expect(() => {
      app.connections;
    }).toThrow(/This Application isn\'t associated with a VPC/);
  });

  test('validating vpc provided when using connections for imported App', () => {
    let app = flink.Application.fromApplicationName(stack, 'FlinkApplication', 'Name');
    expect(() => {
      app.connections;
    }).toThrow(/This Application isn\'t associated with a VPC/);
  });

  test('validating applicationName', () => {
    // Expect no error with valid name
    new flink.Application(stack, 'ValidString', {
      ...requiredProps,
      applicationName: 'my-VALID.app_name',
    });

    // Expect no error with ref
    new flink.Application(stack, 'ValidRef', {
      ...requiredProps,
      applicationName: new core.CfnParameter(stack, 'Parameter').valueAsString,
    });

    expect(() => {
      new flink.Application(stack, 'Empty', {
        ...requiredProps,
        applicationName: '',
      });
    }).toThrow(/cannot be empty/);

    expect(() => {
      new flink.Application(stack, 'InvalidCharacters', {
        ...requiredProps,
        applicationName: '!!!',
      });
    }).toThrow(/may only contain letters, numbers, underscores, hyphens, and periods/);

    expect(() => {
      new flink.Application(stack, 'TooLong', {
        ...requiredProps,
        applicationName: 'a'.repeat(129),
      });
    }).toThrow(/max length is 128/);
  });

  test('validating parallelism', () => {
    // Expect no error with valid value
    new flink.Application(stack, 'ValidNumber', {
      ...requiredProps,
      parallelism: 32,
    });

    // Expect no error with ref
    new flink.Application(stack, 'ValidRef', {
      ...requiredProps,
      parallelism: new core.CfnParameter(stack, 'Parameter', {
        type: 'Number',
      }).valueAsNumber,
    });

    expect(() => {
      new flink.Application(stack, 'TooSmall', {
        ...requiredProps,
        parallelism: 0,
      });
    }).toThrow(/must be at least 1/);
  });

  test('validating parallelismPerKpu', () => {
    // Expect no error with valid value
    new flink.Application(stack, 'ValidNumber', {
      ...requiredProps,
      parallelismPerKpu: 10,
    });

    // Expect no error with ref
    new flink.Application(stack, 'ValidRef', {
      ...requiredProps,
      parallelismPerKpu: new core.CfnParameter(stack, 'Parameter', {
        type: 'Number',
      }).valueAsNumber,
    });

    expect(() => {
      new flink.Application(stack, 'TooSmall', {
        ...requiredProps,
        parallelismPerKpu: 0,
      });
    }).toThrow(/must be at least 1/);
  });

  test('fromFlinkApplicationName', () => {
    const flinkApp = flink.Application.fromApplicationName(stack, 'Imported', 'my-app');

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
    const arn = 'arn:aws:kinesisanalytics:us-west-2:012345678901:application/my-app';
    const flinkApp = flink.Application.fromApplicationArn(stack, 'Imported', arn);

    expect(flinkApp.applicationName).toEqual('my-app');
    expect(flinkApp.applicationArn).toEqual(arn);
    expect(flinkApp.addToRolePolicy(new iam.PolicyStatement())).toBe(false);
  });

  test('fromFlinkApplicationAttributes', () => {
    const arn = 'arn:aws:kinesisanalytics:us-west-2:012345678901:application/my-app';
    const flinkApp = flink.Application.fromApplicationAttributes(stack, 'Imported', {
      applicationArn: arn,
    });

    expect(flinkApp.applicationName).toEqual('my-app');
    expect(flinkApp.applicationArn).toEqual(arn);
    expect(flinkApp.addToRolePolicy(new iam.PolicyStatement())).toBe(false);
  });

  test('get metric', () => {
    const flinkApp = new flink.Application(stack, 'Application', { ...requiredProps });
    expect(flinkApp.metric('KPUs', { statistic: 'Sum' }))
      .toMatchObject({
        namespace: 'AWS/KinesisAnalytics',
        metricName: 'KPUs',
        dimensions: { Application: flinkApp.applicationName },
        statistic: 'Sum',
      });
  });

  test('canned metrics', () => {
    const flinkApp = new flink.Application(stack, 'Application', { ...requiredProps });

    // Table driven test with: [method, metricName, default statistic]
    const assertions: Array<[(options?: cloudwatch.MetricOptions) => cloudwatch.Metric, string, string]> = [
      [flinkApp.metricKpus, 'KPUs', 'Average'],
      [flinkApp.metricDowntime, 'downtime', 'Average'],
      [flinkApp.metricUptime, 'uptime', 'Average'],
      [flinkApp.metricFullRestarts, 'fullRestarts', 'Sum'],
      [flinkApp.metricNumberOfFailedCheckpoints, 'numberOfFailedCheckpoints', 'Sum'],
      [flinkApp.metricLastCheckpointDuration, 'lastCheckpointDuration', 'Maximum'],
      [flinkApp.metricLastCheckpointSize, 'lastCheckpointSize', 'Maximum'],
      [flinkApp.metricCpuUtilization, 'cpuUtilization', 'Average'],
      [flinkApp.metricHeapMemoryUtilization, 'heapMemoryUtilization', 'Average'],
      [flinkApp.metricOldGenerationGCTime, 'oldGenerationGCTime', 'Sum'],
      [flinkApp.metricOldGenerationGCCount, 'oldGenerationGCCount', 'Sum'],
      [flinkApp.metricThreadsCount, 'threadsCount', 'Average'],
      [flinkApp.metricNumRecordsIn, 'numRecordsIn', 'Average'],
      [flinkApp.metricNumRecordsInPerSecond, 'numRecordsInPerSecond', 'Average'],
      [flinkApp.metricNumRecordsOut, 'numRecordsOut', 'Average'],
      [flinkApp.metricNumRecordsOutPerSecond, 'numRecordsOutPerSecond', 'Average'],
      [flinkApp.metricNumLateRecordsDropped, 'numLateRecordsDropped', 'Sum'],
      [flinkApp.metricCurrentInputWatermark, 'currentInputWatermark', 'Maximum'],
      [flinkApp.metricCurrentOutputWatermark, 'currentOutputWatermark', 'Maximum'],
      [flinkApp.metricManagedMemoryUsed, 'managedMemoryUsed', 'Average'],
      [flinkApp.metricManagedMemoryTotal, 'managedMemoryTotal', 'Average'],
      [flinkApp.metricManagedMemoryUtilization, 'managedMemoryUtilization', 'Average'],
      [flinkApp.metricIdleTimeMsPerSecond, 'idleTimeMsPerSecond', 'Average'],
      [flinkApp.metricBackPressuredTimeMsPerSecond, 'backPressuredTimeMsPerSecond', 'Average'],
      [flinkApp.metricBusyTimePerMsPerSecond, 'busyTimePerMsPerSecond', 'Average'],
    ];

    assertions.forEach(([method, metricName, defaultStatistic]) => {
      // Test metrics with no options provided
      expect(method.call(flinkApp)).toMatchObject({
        metricName,
        statistic: defaultStatistic,
        namespace: 'AWS/KinesisAnalytics',
        dimensions: {
          Application: flinkApp.applicationName,
        },
      });

      // Make sure we can override the default statistic and add other options
      expect(method.call(flinkApp, { statistic: 'special', color: '#00ff00' })).toMatchObject({
        statistic: 'special',
        color: '#00ff00',
      });
    });
  });
});
