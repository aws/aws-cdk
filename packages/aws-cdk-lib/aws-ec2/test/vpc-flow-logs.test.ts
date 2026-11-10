import { Template, Match } from '../../assertions';
import * as iam from '../../aws-iam';
import * as firehose from '../../aws-kinesisfirehose';
import * as logs from '../../aws-logs';
import * as s3 from '../../aws-s3';
import { App, RemovalPolicy, Stack } from '../../core';
import { FlowLog, FlowLogDestination, FlowLogResourceType, FlowLogMaxAggregationInterval, LogFormat, Vpc, FlowLogTrafficType } from '../lib';

describe('vpc flow logs', () => {
  describe('default VPC Flow Logs CloudWatch role confused-deputy trust', () => {
    const account = '111122223333';
    const region = 'us-east-1';
    const trustFlag = '@aws-cdk/aws-ec2:flowLogsCloudWatchLogsTrustScoped';
    const partitionLiteralFlag = '@aws-cdk/core:enablePartitionLiterals';

    function testStack(enabled?: boolean, environment?: { account: string; region: string }, literalPartitions = false): Stack {
      const context: { [key: string]: boolean } = {};
      if (enabled !== undefined) {
        context[trustFlag] = enabled;
      }
      if (literalPartitions) {
        context[partitionLiteralFlag] = true;
      }
      return new Stack(new App({ context }), 'FlowLogTrustTest', {
        env: environment ?? { account, region },
      });
    }

    function createLog(stack: Stack): void {
      new FlowLog(stack, 'FlowLogs', {
        resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
      });
    }

    function singleRole(stack: Stack): any {
      const roles = Object.values(Template.fromStack(stack).findResources('AWS::IAM::Role'));
      expect(roles).toHaveLength(1);
      return roles[0];
    }

    test.each([undefined, false])('preserves exact legacy trust when flag is %s', enabled => {
      const stack = testStack(enabled);
      createLog(stack);
      expect(singleRole(stack).Properties.AssumeRolePolicyDocument.Statement).toEqual([{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'vpc-flow-logs.amazonaws.com' },
      }]);
    });

    test.each([
      ['aws', 'us-east-1', 'arn:aws:ec2:us-east-1:111122223333:vpc-flow-log/*'],
      ['aws-cn', 'cn-north-1', 'arn:aws-cn:ec2:cn-north-1:111122223333:vpc-flow-log/*'],
      ['aws-us-gov', 'us-gov-west-1', 'arn:aws-us-gov:ec2:us-gov-west-1:111122223333:vpc-flow-log/*'],
    ])('uses independently specified ARN for partition %s (%s)', (_partition, targetRegion, expectedArn) => {
      const stack = testStack(true, { account, region: targetRegion }, true);
      createLog(stack);
      expect(singleRole(stack).Properties.AssumeRolePolicyDocument.Statement).toEqual([{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'vpc-flow-logs.amazonaws.com' },
        Condition: {
          StringEquals: { 'aws:SourceAccount': '111122223333' },
          ArnLike: { 'aws:SourceArn': expectedArn },
        },
      }]);
    });

    test('preserves account, region and partition pseudo-parameters without an explicit env', () => {
      const stack = new Stack(new App({ context: { [trustFlag]: true, [partitionLiteralFlag]: true } }), 'AgnosticFlowLog');
      createLog(stack);
      const statement = singleRole(stack).Properties.AssumeRolePolicyDocument.Statement[0];
      expect(statement.Action).toBe('sts:AssumeRole');
      expect(statement.Principal).toEqual({ Service: 'vpc-flow-logs.amazonaws.com' });
      expect(statement.Condition.StringEquals).toEqual({ 'aws:SourceAccount': { Ref: 'AWS::AccountId' } });
      const actualArn = JSON.stringify(statement.Condition.ArnLike['aws:SourceArn']);
      for (const segment of ['AWS::Partition', 'AWS::Region', 'AWS::AccountId', 'vpc-flow-log/*']) {
        expect(actualArn).toContain(segment);
      }
      expect(actualArn).not.toContain('vpc-flow-log:*');
    });

    test('preserves the exact caller-supplied role trust statement', () => {
      const stack = testStack(true);
      const originalConditions = { StringEquals: { 'aws:SourceAccount': '999988887777' } };
      const role = new iam.Role(stack, 'UserRole', {
        assumedBy: new iam.ServicePrincipal('vpc-flow-logs.amazonaws.com', { conditions: originalConditions }),
      });
      new FlowLog(stack, 'FlowLogs', {
        resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
        destination: FlowLogDestination.toCloudWatchLogs(new logs.LogGroup(stack, 'ExistingLogGroup'), role),
      });
      expect(singleRole(stack).Properties.AssumeRolePolicyDocument.Statement).toEqual([{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'vpc-flow-logs.amazonaws.com' },
        Condition: originalConditions,
      }]);
    });

    test('scopes Vpc.addFlowLog default role without changing the flow log resource', () => {
      const stack = testStack(true, { account, region }, true);
      const vpc = new Vpc(stack, 'Vpc');
      vpc.addFlowLog('FlowLogs');
      const t = Template.fromStack(stack);
      t.resourceCountIs('AWS::EC2::FlowLog', 1);
      t.resourceCountIs('AWS::IAM::Role', 1);
      const statement = singleRole(stack).Properties.AssumeRolePolicyDocument.Statement[0];
      expect(statement.Condition).toEqual({
        StringEquals: { 'aws:SourceAccount': account },
        ArnLike: { 'aws:SourceArn': 'arn:aws:ec2:us-east-1:111122223333:vpc-flow-log/*' },
      });
    });

    test('preserves FlowLog, LogGroup, identity policy and every other role property', () => {
      const legacy = testStack(false, { account, region }, true);
      const scoped = testStack(true, { account, region }, true);
      createLog(legacy);
      createLog(scoped);
      const oldTemplate = Template.fromStack(legacy);
      const newTemplate = Template.fromStack(scoped);
      for (const type of ['AWS::EC2::FlowLog', 'AWS::Logs::LogGroup', 'AWS::IAM::Policy']) {
        expect(newTemplate.findResources(type)).toEqual(oldTemplate.findResources(type));
      }
      const oldRole = JSON.parse(JSON.stringify(singleRole(legacy)));
      const newRole = JSON.parse(JSON.stringify(singleRole(scoped)));
      expect(newRole.Properties.AssumeRolePolicyDocument.Statement[0].Condition).toEqual({
        StringEquals: { 'aws:SourceAccount': account },
        ArnLike: { 'aws:SourceArn': 'arn:aws:ec2:us-east-1:111122223333:vpc-flow-log/*' },
      });
      delete newRole.Properties.AssumeRolePolicyDocument.Statement[0].Condition;
      expect(newRole).toEqual(oldRole);
    });

    test('trust policy does not depend on the generated FlowLog resource ID', () => {
      const stack = testStack(true, { account, region }, true);
      createLog(stack);
      const template = Template.fromStack(stack);
      const flowLogIds = Object.keys(template.findResources('AWS::EC2::FlowLog'));
      const role = singleRole(stack);
      const trust = JSON.stringify(role.Properties.AssumeRolePolicyDocument);
      for (const id of flowLogIds) {
        expect(trust).not.toContain(id);
        expect(role.DependsOn ?? []).not.toContain(id);
      }
    });
  });
  test('with defaults set, it successfully creates with cloudwatch logs destination', () => {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      ResourceType: 'NetworkInterface',
      TrafficType: 'ALL',
      ResourceId: 'eni-123455',
      DeliverLogsPermissionArn: {
        'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
      },
      LogGroupName: {
        Ref: 'FlowLogsLogGroup9853A85F',
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: [
            'logs:CreateLogStream',
            'logs:PutLogEvents',
            'logs:DescribeLogStreams',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': ['FlowLogsLogGroup9853A85F', 'Arn'],
          },
        }],
      },
    });
    Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 0);
  });
  test('with cloudwatch logs as the destination, allows use of existing resources', () => {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
      destination: FlowLogDestination.toCloudWatchLogs(
        new logs.LogGroup(stack, 'TestLogGroup', {
          retention: logs.RetentionDays.FIVE_DAYS,
        }),
        new iam.Role(stack, 'TestRole', {
          roleName: 'TestName',
          assumedBy: new iam.ServicePrincipal('vpc-flow-logs.amazonaws.com'),
        }),
      ),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: 5,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      RoleName: 'TestName',
    });
    Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 0);
  });
  test('with s3 as the destination, allows use of existing resources', () => {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
      destination: FlowLogDestination.toS3(
        new s3.Bucket(stack, 'TestBucket', {
          bucketName: 'testbucket',
        }),
      ),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      DestinationOptions: Match.absent(),
    });
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'testbucket',
    });
  });

  test('with Amazon Data Firehose deliveryStreamArn as the destination, allows use of existing resources', () => {
    const stack = getTestStack();

    const deliveryStreamArn = Stack.of(stack).formatArn({
      resource: 'deliverystream',
      region: '',
      service: 'firehose',
      account: '',
      resourceName: 'testdeliverystream',
    });
    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
      destination: FlowLogDestination.toKinesisDataFirehoseDestination(
        deliveryStreamArn,
      ),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      DestinationOptions: Match.absent(),
      LogDestinationType: 'kinesis-data-firehose',
      LogDestination: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':firehose:::deliverystream/testdeliverystream']] },
    });
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
    Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 0);
  });

  test('with Amazon Data Firehose delivery stream as the destination, allows use of existing resources', () => {
    const stack = getTestStack();

    const bucket = new s3.Bucket(stack, 'Bucket');
    const deliveryStream = new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.S3Bucket(bucket, {
        loggingConfig: new firehose.DisableLogging(),
      }),
    });
    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
      destination: FlowLogDestination.toFirehose(deliveryStream),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      DestinationOptions: Match.absent(),
      LogDestinationType: 'kinesis-data-firehose',
      LogDestination: { 'Fn::GetAtt': ['DeliveryStream58CF96DB', 'Arn'] },
    });
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
    Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
  });

  test('with Amazon Data Firehose delivery stream as the destination with cross-account log delivery', () => {
    const stack = getTestStack();

    const bucket = new s3.Bucket(stack, 'Bucket');
    const deliveryStream = new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.S3Bucket(bucket, {
        loggingConfig: new firehose.DisableLogging(),
      }),
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('delivery.logs.amazonaws.com'),
    });
    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
      destination: FlowLogDestination.toFirehose(deliveryStream, role),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      DestinationOptions: Match.absent(),
      LogDestinationType: 'kinesis-data-firehose',
      LogDestination: { 'Fn::GetAtt': ['DeliveryStream58CF96DB', 'Arn'] },
      DeliverLogsPermissionArn: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
    });
  });

  test('toFirehose() throws when cross-account delivery and iamRole is missing', () => {
    const stack = getTestStack();
    const bucket = new s3.Bucket(stack, 'Bucket');

    const crossAccountStack = new Stack(undefined, 'CrossAccountStack', {
      env: { account: '234567890123', region: 'us-east-1' },
    });
    const deliveryStream = new firehose.DeliveryStream(crossAccountStack, 'DeliveryStream', {
      destination: new firehose.S3Bucket(bucket, {
        loggingConfig: new firehose.DisableLogging(),
      }),
    });

    expect(() => {
      new FlowLog(stack, 'FlowLogs', {
        resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
        destination: FlowLogDestination.toFirehose(deliveryStream),
      });
    }).toThrow('The iamRole is required for cross-account log delivery.');
  });

  test('with flowLogName, adds Name tag with the name', () => {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
      flowLogName: 'CustomFlowLogName',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      Tags: [
        {
          Key: 'Name',
          Value: 'CustomFlowLogName',
        },
      ],
    });
  });

  test('allows setting destination options', () => {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
      destination: FlowLogDestination.toS3(undefined, undefined, {
        hiveCompatiblePartitions: true,
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      ResourceType: 'NetworkInterface',
      TrafficType: 'ALL',
      ResourceId: 'eni-123456',
      DestinationOptions: {
        hiveCompatiblePartitions: true,
        fileFormat: 'plain-text',
        perHourPartition: false,
      },
      LogDestination: {
        'Fn::GetAtt': [
          'FlowLogsBucket87F67F60',
          'Arn',
        ],
      },
      LogDestinationType: 's3',
    });
  });

  describe('s3 bucket policy - @aws-cdk/aws-s3:createDefaultLoggingPolicy feature flag', () => {
    test('creates default S3 bucket policy with options', () => {
      const stack = new Stack();
      stack.node.setContext('@aws-cdk/aws-s3:createDefaultLoggingPolicy', true);
      new FlowLog(stack, 'FlowLogs', {
        resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
        destination: FlowLogDestination.toS3(undefined, 'custom-prefix', {
          hiveCompatiblePartitions: true,
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 's3:PutObject',
              Effect: 'Allow',
              Condition: {
                StringEquals: {
                  's3:x-amz-acl': 'bucket-owner-full-control',
                  'aws:SourceAccount': {
                    Ref: 'AWS::AccountId',
                  },
                },
                ArnLike: {
                  'aws:SourceArn': {
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
                        ':*',
                      ],
                    ],
                  },
                },
              },
              Principal: {
                Service: 'delivery.logs.amazonaws.com',
              },
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'FlowLogsBucket87F67F60',
                        'Arn',
                      ],
                    },
                    '/custom-prefix/AWSLogs/aws-account-id=',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    '/*',
                  ],
                ],
              },
            },
            {
              Action: [
                's3:GetBucketAcl',
                's3:ListBucket',
              ],
              Condition: {
                StringEquals: {
                  'aws:SourceAccount': {
                    Ref: 'AWS::AccountId',
                  },
                },
                ArnLike: {
                  'aws:SourceArn': {
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
                        ':*',
                      ],
                    ],
                  },
                },
              },
              Effect: 'Allow',
              Principal: {
                Service: 'delivery.logs.amazonaws.com',
              },
              Resource: {
                'Fn::GetAtt': [
                  'FlowLogsBucket87F67F60',
                  'Arn',
                ],
              },
            },
          ],
        },
      });
    });

    test('creates default S3 bucket policy', () => {
      const stack = new Stack();
      stack.node.setContext('@aws-cdk/aws-s3:createDefaultLoggingPolicy', true);
      new FlowLog(stack, 'FlowLogs', {
        resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
        destination: FlowLogDestination.toS3(),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 's3:PutObject',
              Effect: 'Allow',
              Condition: {
                StringEquals: {
                  's3:x-amz-acl': 'bucket-owner-full-control',
                  'aws:SourceAccount': {
                    Ref: 'AWS::AccountId',
                  },
                },
                ArnLike: {
                  'aws:SourceArn': {
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
                        ':*',
                      ],
                    ],
                  },
                },
              },
              Principal: {
                Service: 'delivery.logs.amazonaws.com',
              },
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'FlowLogsBucket87F67F60',
                        'Arn',
                      ],
                    },
                    '/AWSLogs/',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    '/*',
                  ],
                ],
              },
            },
            {
              Action: [
                's3:GetBucketAcl',
                's3:ListBucket',
              ],
              Condition: {
                StringEquals: {
                  'aws:SourceAccount': {
                    Ref: 'AWS::AccountId',
                  },
                },
                ArnLike: {
                  'aws:SourceArn': {
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
                        ':*',
                      ],
                    ],
                  },
                },
              },
              Effect: 'Allow',
              Principal: {
                Service: 'delivery.logs.amazonaws.com',
              },
              Resource: {
                'Fn::GetAtt': [
                  'FlowLogsBucket87F67F60',
                  'Arn',
                ],
              },
            },
          ],
        },
      });
    });

    test('adds necessary dependencies', () => {
      const stack = new Stack();
      stack.node.setContext('@aws-cdk/aws-s3:createDefaultLoggingPolicy', true);
      const bucket = new s3.Bucket(stack, 'Bucket', {
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      });
      new FlowLog(stack, 'FlowLogs', {
        resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
        destination: FlowLogDestination.toS3(bucket),
      });

      const template = Template.fromStack(stack);
      template.hasResource('AWS::EC2::FlowLog', {
        Properties: Match.anyValue(),
        DependsOn: [
          'BucketAutoDeleteObjectsCustomResourceBAFD23C2',
          'BucketPolicyE9A3008A',
        ],
      });
    });

    test('without future flag, does not create default bucket policy', () => {
      const stack = new Stack();
      new FlowLog(stack, 'FlowLogs', {
        resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
        destination: FlowLogDestination.toS3(),
      });

      Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 0);
    });
  });

  test('with s3 as the destination, allows use of key prefix', () => {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
      destination: FlowLogDestination.toS3(
        new s3.Bucket(stack, 'TestBucket', {
          bucketName: 'testbucket',
        }),
        'FlowLogs/',
      ),
    });

    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'testbucket',
    });
  });
  test('with s3 as the destination and all the defaults set, it successfully creates all the resources', () => {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
      destination: FlowLogDestination.toS3(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      ResourceType: 'NetworkInterface',
      TrafficType: 'ALL',
      ResourceId: 'eni-123456',
      LogDestination: {
        'Fn::GetAtt': ['FlowLogsBucket87F67F60', 'Arn'],
      },
    });
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
  });
  test('create with vpc', () => {
    const stack = getTestStack();

    new Vpc(stack, 'VPC', {
      flowLogs: {
        flowLogs: {},
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      ResourceType: 'VPC',
      TrafficType: 'ALL',
      ResourceId: {
        Ref: 'VPCB9E5F0B4',
      },
      DeliverLogsPermissionArn: {
        'Fn::GetAtt': ['VPCflowLogsIAMRole9D21E1A6', 'Arn'],
      },
      LogGroupName: {
        Ref: 'VPCflowLogsLogGroupE900F980',
      },
    });
  });
  test('add to vpc', () => {
    const stack = getTestStack();

    const vpc = new Vpc(stack, 'VPC');
    vpc.addFlowLog('FlowLogs');

    Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      ResourceType: 'VPC',
      TrafficType: 'ALL',
      ResourceId: {
        Ref: 'VPCB9E5F0B4',
      },
      DeliverLogsPermissionArn: {
        'Fn::GetAtt': ['VPCFlowLogsIAMRole55343234', 'Arn'],
      },
      LogGroupName: {
        Ref: 'VPCFlowLogsLogGroupF48E1B0A',
      },
    });
  });
  test('flowlog has defaultchild', () => {
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    const flowlog = new FlowLog(stack, 'FlowLog', {
      resourceType: FlowLogResourceType.fromVpc(vpc),
    });

    expect(flowlog.node.defaultChild).toBeDefined();
  });
  test('flowlog change maxAggregationInterval', () => {
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    new FlowLog(stack, 'FlowLog', {
      resourceType: FlowLogResourceType.fromVpc(vpc),
      maxAggregationInterval: FlowLogMaxAggregationInterval.ONE_MINUTE,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      ResourceType: 'VPC',
      TrafficType: 'ALL',

      DeliverLogsPermissionArn: {
        'Fn::GetAtt': ['FlowLogIAMRoleDCBD2EB4', 'Arn'],
      },
      LogDestinationType: 'cloud-watch-logs',
      LogGroupName: {
        Ref: 'FlowLogLogGroupAFFB9038',
      },
      MaxAggregationInterval: 60,
    });
  });

  test('create from transit gateway`', () => {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromTransitGatewayId('tgw-123456'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      ResourceType: 'TransitGateway',
      ResourceId: 'tgw-123456',
      DeliverLogsPermissionArn: {
        'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
      },
      LogGroupName: {
        Ref: 'FlowLogsLogGroup9853A85F',
      },
    });
  });

  test('throw if transit gateway with traffic type', () => {
    const stack = getTestStack();

    expect(() => {
      new FlowLog(stack, 'FlowLogs', {
        resourceType: FlowLogResourceType.fromTransitGatewayId('tgw-123456'),
        trafficType: FlowLogTrafficType.REJECT,
      });
    }).toThrow(/trafficType is not supported for Transit Gateway and Transit Gateway Attachment/);
  });

  test('create from transit gateway attachment', () => {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromTransitGatewayAttachmentId('tgw-attach-123456'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
      ResourceType: 'TransitGatewayAttachment',
      ResourceId: 'tgw-attach-123456',
      DeliverLogsPermissionArn: {
        'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
      },
      LogGroupName: {
        Ref: 'FlowLogsLogGroup9853A85F',
      },
    });
  });

  test('throw if transit gateway attachment with traffic type', () => {
    const stack = getTestStack();

    expect(() => {
      new FlowLog(stack, 'FlowLogs', {
        resourceType: FlowLogResourceType.fromTransitGatewayAttachmentId('tgw-attach-123456'),
        trafficType: FlowLogTrafficType.REJECT,
      });
    }).toThrow(/trafficType is not supported for Transit Gateway and Transit Gateway Attachment/);
  });

  test('throw if transit gateway with value other than maxAggregationInterval.ONE_MINUTES', () => {
    const stack = getTestStack();

    expect(() => {
      new FlowLog(stack, 'FlowLogs', {
        resourceType: FlowLogResourceType.fromTransitGatewayId('tgw-123456'),
        maxAggregationInterval: FlowLogMaxAggregationInterval.TEN_MINUTES,
      });
    }).toThrow(/maxAggregationInterval must be set to ONE_MINUTE for Transit Gateway and Transit Gateway Attachment/);
  });

  test('throw if transit gateway attachment with maxAggregationInterval value other than maxAggregationInterval.ONE_MINUTES', () => {
    const stack = getTestStack();

    expect(() => {
      new FlowLog(stack, 'FlowLogs', {
        resourceType: FlowLogResourceType.fromTransitGatewayAttachmentId('tgw-attach-123456'),
        maxAggregationInterval: FlowLogMaxAggregationInterval.TEN_MINUTES,
      });
    }).toThrow(/maxAggregationInterval must be set to ONE_MINUTE for Transit Gateway and Transit Gateway Attachment/);
  });
});

test('add to vpc with maxAggregationInterval', () => {
  const stack = getTestStack();

  const vpc = new Vpc(stack, 'VPC');
  vpc.addFlowLog('FlowLogs', {
    maxAggregationInterval: FlowLogMaxAggregationInterval.ONE_MINUTE,
  });

  Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
    ResourceType: 'VPC',
    TrafficType: 'ALL',
    ResourceId: {
      Ref: 'VPCB9E5F0B4',
    },
    DeliverLogsPermissionArn: {
      'Fn::GetAtt': ['VPCFlowLogsIAMRole55343234', 'Arn'],
    },
    LogGroupName: {
      Ref: 'VPCFlowLogsLogGroupF48E1B0A',
    },
    MaxAggregationInterval: 60,
  });
});

test('with custom log format set, it successfully creates with cloudwatch log destination', () => {
  const stack = getTestStack();

  new FlowLog(stack, 'FlowLogs', {
    resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
    logFormat: [
      LogFormat.SRC_PORT,
      LogFormat.DST_PORT,
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
    ResourceType: 'NetworkInterface',
    TrafficType: 'ALL',
    ResourceId: 'eni-123455',
    DeliverLogsPermissionArn: {
      'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
    },
    LogFormat: '${srcport} ${dstport}',
    LogGroupName: {
      Ref: 'FlowLogsLogGroup9853A85F',
    },
  });
});

test('log format for built-in types is correct', () => {
  const stack = getTestStack();

  const vpc = new Vpc(stack, 'TestVpc');
  new FlowLog(stack, 'FlowLogs1', {
    resourceType: FlowLogResourceType.fromVpc(vpc),
    logFormat: [
      LogFormat.VERSION,
      LogFormat.ACCOUNT_ID,
      LogFormat.INTERFACE_ID,
      LogFormat.SRC_ADDR,
      LogFormat.DST_ADDR,
      LogFormat.SRC_PORT,
      LogFormat.DST_PORT,
      LogFormat.PROTOCOL,
      LogFormat.PACKETS,
      LogFormat.BYTES,
      LogFormat.START_TIMESTAMP,
      LogFormat.END_TIMESTAMP,
      LogFormat.ACTION,
      LogFormat.LOG_STATUS,
      LogFormat.VPC_ID,
      LogFormat.SUBNET_ID,
      LogFormat.INSTANCE_ID,
      LogFormat.TCP_FLAGS,
      LogFormat.TRAFFIC_TYPE,
      LogFormat.PKT_SRC_ADDR,
      LogFormat.PKT_DST_ADDR,
      LogFormat.REGION,
      LogFormat.AZ_ID,
      LogFormat.SUBLOCATION_TYPE,
      LogFormat.SUBLOCATION_ID,
      LogFormat.PKT_SRC_AWS_SERVICE,
      LogFormat.PKT_DST_AWS_SERVICE,
      LogFormat.FLOW_DIRECTION,
      LogFormat.TRAFFIC_PATH,
      LogFormat.ECS_CLUSTER_ARN,
      LogFormat.ECS_CLUSTER_NAME,
      LogFormat.ECS_CONTAINER_INSTANCE_ARN,
      LogFormat.ECS_CONTAINER_INSTANCE_ID,
      LogFormat.ECS_CONTAINER_ID,
      LogFormat.ECS_SECOND_CONTAINER_ID,
      LogFormat.ECS_SERVICE_NAME,
      LogFormat.ECS_TASK_DEFINITION_ARN,
      LogFormat.ECS_TASK_ARN,
      LogFormat.ECS_TASK_ID,
    ],
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::EC2::FlowLog', {
    LogFormat: ('${version} ${account-id} ${interface-id} ${srcaddr} ${dstaddr} ${srcport} '
                + '${dstport} ${protocol} ${packets} ${bytes} ${start} ${end} ${action} ${log-status} '
                + '${vpc-id} ${subnet-id} ${instance-id} ${tcp-flags} ${type} ${pkt-srcaddr} '
                + '${pkt-dstaddr} ${region} ${az-id} ${sublocation-type} ${sublocation-id} '
                + '${pkt-src-aws-service} ${pkt-dst-aws-service} ${flow-direction} ${traffic-path} '
                + '${ecs-cluster-arn} ${ecs-cluster-name} ${ecs-container-instance-arn} ${ecs-container-instance-id} '
                + '${ecs-container-id} ${ecs-second-container-id} ${ecs-service-name} ${ecs-task-definition-arn} '
                + '${ecs-task-arn} ${ecs-task-id}'),
  });
});

test('with custom log format set empty, it not creates with cloudwatch log destination', () => {
  const stack = getTestStack();

  new FlowLog(stack, 'FlowLogs', {
    resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
    logFormat: [],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
    ResourceType: 'NetworkInterface',
    TrafficType: 'ALL',
    ResourceId: 'eni-123455',
    DeliverLogsPermissionArn: {
      'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
    },
    LogGroupName: {
      Ref: 'FlowLogsLogGroup9853A85F',
    },
  });
});

function getTestStack(): Stack {
  return new Stack(undefined, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });
}

test('with custom log format set all default field, it not creates with cloudwatch log destination', () => {
  const stack = getTestStack();

  new FlowLog(stack, 'FlowLogs', {
    resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
    logFormat: [
      LogFormat.VERSION,
      LogFormat.ALL_DEFAULT_FIELDS,
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
    ResourceType: 'NetworkInterface',
    TrafficType: 'ALL',
    ResourceId: 'eni-123455',
    DeliverLogsPermissionArn: {
      'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
    },
    LogFormat: '${version} ${version} ${account-id} ${interface-id} ${srcaddr} ${dstaddr} ${srcport} ${dstport} ${protocol} ${packets} ${bytes} ${start} ${end} ${action} ${log-status}',
    LogGroupName: {
      Ref: 'FlowLogsLogGroup9853A85F',
    },
  });
});

test('with custom log format set custom, it not creates with cloudwatch log destination', () => {
  const stack = getTestStack();

  new FlowLog(stack, 'FlowLogs', {
    resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
    logFormat: [
      LogFormat.SRC_PORT,
      LogFormat.custom('${new-field}'),
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
    ResourceType: 'NetworkInterface',
    TrafficType: 'ALL',
    ResourceId: 'eni-123455',
    DeliverLogsPermissionArn: {
      'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
    },
    LogFormat: '${srcport} ${new-field}',
    LogGroupName: {
      Ref: 'FlowLogsLogGroup9853A85F',
    },
  });
});
