import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as cdk from 'aws-cdk-lib';
import { Construct, Node } from 'constructs';
import * as firehose from '../lib';
import { StreamEncryption } from '../lib';
import * as source from '../lib/source';

describe('delivery stream', () => {
  let stack: cdk.Stack;
  let deliveryStreamRole: iam.IRole;
  let dependable: Construct;
  let mockS3Destination: firehose.IDestination;

  const bucketArn = 'arn:aws:s3:::my-bucket';
  const roleArn = 'arn:aws:iam::111122223333:role/my-role';

  beforeEach(() => {
    stack = new cdk.Stack();
    deliveryStreamRole = new iam.Role(stack, 'DeliveryStreamRole', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
    mockS3Destination = {
      bind(scope: Construct, _options: firehose.DestinationBindOptions): firehose.DestinationConfig {
        dependable = new class extends Construct {
          constructor(depScope: Construct, id: string) {
            super(depScope, id);
            new cdk.CfnResource(this, 'Resource', { type: 'CDK::Dummy' });
          }
        }(scope, 'Dummy Dep');
        return {
          extendedS3DestinationConfiguration: {
            bucketArn: bucketArn,
            roleArn: roleArn,
          },
          dependables: [dependable],
        };
      },
    };
  });

  test('creates stream with default values', () => {
    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      DeliveryStreamEncryptionConfigurationInput: Match.absent(),
      DeliveryStreamName: Match.absent(),
      DeliveryStreamType: 'DirectPut',
      KinesisStreamSourceConfiguration: Match.absent(),
      ExtendedS3DestinationConfiguration: {
        BucketARN: bucketArn,
        RoleARN: roleArn,
      },
    });
  });

  test('creates stream with events target V2 class', () => {
    const stream = new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: mockS3Destination,
    });

    new events.Rule(stack, 'rule', {
      eventPattern: {
        source: ['aws.s3'],
        detail: {
          eventName: ['PutObject'],
        },
      },
    }).addTarget(new targets.KinesisFirehoseStreamV2(firehose.DeliveryStream.fromDeliveryStreamArn(stack, 'firehose', stream.deliveryStreamArn)));

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      Targets: [
        {
          Arn: {
            'Fn::GetAtt': [
              'DeliveryStream58CF96DB',
              'Arn',
            ],
          },
          Id: 'Target0',
          RoleArn: {
            'Fn::GetAtt': [
              'firehoseEventsRole71BC7157',
              'Arn',
            ],
          },
        },
      ],
    });
  });

  test('provided role is set as grant principal', () => {
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    const deliveryStream = new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
      role: role,
    });

    expect(deliveryStream.grantPrincipal).toBe(role);
  });

  test('not providing sourceStream or encryptionKey creates only one role (used for S3 destination)', () => {
    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          Match.objectLike({
            Principal: {
              Service: 'firehose.amazonaws.com',
            },
          }),
        ],
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
  });

  test('not providing role but specifying sourceStream creates two roles', () => {
    const sourceStream = new kinesis.Stream(stack, 'Source Stream');

    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
      source: new source.KinesisStreamSource(sourceStream),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          Match.objectLike({
            Principal: {
              Service: 'firehose.amazonaws.com',
            },
          }),
        ],
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 2);
  });

  test('not providing role but using customerManagedKey encryption with a key creates two roles', () => {
    const key = new kms.Key(stack, 'Key');

    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
      encryption: StreamEncryption.customerManagedKey(key),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          Match.objectLike({
            Principal: {
              Service: 'firehose.amazonaws.com',
            },
          }),
        ],
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 2);
  });

  test('providing source stream creates configuration and grants permission', () => {
    const sourceStream = new kinesis.Stream(stack, 'Source Stream');

    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
      source: new source.KinesisStreamSource(sourceStream),
      role: deliveryStreamRole,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: Match.arrayWith([
              'kinesis:GetRecords',
              'kinesis:GetShardIterator',
              'kinesis:ListShards',
              'kinesis:DescribeStream',
            ]),
            Resource: stack.resolve(sourceStream.streamArn),
          },
        ],
      },
      Roles: [stack.resolve(deliveryStreamRole.roleName)],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      DeliveryStreamType: 'KinesisStreamAsSource',
      KinesisStreamSourceConfiguration: {
        KinesisStreamARN: stack.resolve(sourceStream.streamArn),
        RoleARN: stack.resolve(deliveryStreamRole.roleArn),
      },
    });
    Template.fromStack(stack).hasResource('AWS::KinesisFirehose::DeliveryStream', {
      DependsOn: Match.arrayWith(['DeliveryStreamRoleDefaultPolicy2759968B']),
    });
  });

  test('requesting customer-owned encryption creates key and configuration', () => {
    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
      encryption: firehose.StreamEncryption.customerManagedKey(),
      role: deliveryStreamRole,
    });

    Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          Match.objectLike({
            Action: Match.arrayWith([
              'kms:Decrypt',
              'kms:Encrypt',
            ]),
          }),
        ],
      },
      Roles: [stack.resolve(deliveryStreamRole.roleName)],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      DeliveryStreamEncryptionConfigurationInput: {
        KeyARN: {
          'Fn::GetAtt': [
            'DeliveryStreamKey56A6407F',
            'Arn',
          ],
        },
        KeyType: 'CUSTOMER_MANAGED_CMK',
      },
    });
  });

  test('using customerManagedKey encryption with provided key creates configuration', () => {
    const key = new kms.Key(stack, 'Key');

    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
      encryption: StreamEncryption.customerManagedKey(key),
      role: deliveryStreamRole,
    });

    Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          Match.objectLike({
            Action: Match.arrayWith([
              'kms:Decrypt',
              'kms:Encrypt',
            ]),
            Resource: stack.resolve(key.keyArn),
          }),
        ],
      },
      Roles: [stack.resolve(deliveryStreamRole.roleName)],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      DeliveryStreamEncryptionConfigurationInput: {
        KeyARN: stack.resolve(key.keyArn),
        KeyType: 'CUSTOMER_MANAGED_CMK',
      },
    });
  });

  test('requesting AWS-owned key does not create key and creates configuration', () => {
    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
      encryption: firehose.StreamEncryption.awsOwnedKey(),
      role: deliveryStreamRole,
    });

    Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 0);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      DeliveryStreamType: 'DirectPut',
      DeliveryStreamEncryptionConfigurationInput: {
        KeyARN: Match.absent(),
        KeyType: 'AWS_OWNED_CMK',
      },
    });
  });

  test('requesting no encryption creates no configuration', () => {
    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
      encryption: firehose.StreamEncryption.unencrypted(),
      role: deliveryStreamRole,
    });

    Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 0);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      DeliveryStreamType: 'DirectPut',
      DeliveryStreamEncryptionConfigurationInput: Match.absent(),
    });
  });

  test('requesting encryption or providing a key when source is a stream throws an error', () => {
    const sourceStream = new kinesis.Stream(stack, 'Source Stream');

    expect(() => new firehose.DeliveryStream(stack, 'Delivery Stream 1', {
      destination: mockS3Destination,
      encryption: firehose.StreamEncryption.awsOwnedKey(),
      source: new source.KinesisStreamSource(sourceStream),
    })).toThrow('Requested server-side encryption but delivery stream source is a Kinesis data stream. Specify server-side encryption on the data stream instead.');
    expect(() => new firehose.DeliveryStream(stack, 'Delivery Stream 2', {
      destination: mockS3Destination,
      encryption: firehose.StreamEncryption.customerManagedKey(),
      source: new source.KinesisStreamSource(sourceStream),
    })).toThrow('Requested server-side encryption but delivery stream source is a Kinesis data stream. Specify server-side encryption on the data stream instead.');
    expect(() => new firehose.DeliveryStream(stack, 'Delivery Stream 3', {
      destination: mockS3Destination,
      encryption: StreamEncryption.customerManagedKey(new kms.Key(stack, 'Key')),
      source: new source.KinesisStreamSource(sourceStream),
    })).toThrow('Requested server-side encryption but delivery stream source is a Kinesis data stream. Specify server-side encryption on the data stream instead.');
  });

  test('grant provides access to stream', () => {
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const deliveryStream = new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
    });

    deliveryStream.grant(role, 'firehose:PutRecord');

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          Match.objectLike({
            Action: 'firehose:PutRecord',
            Resource: stack.resolve(deliveryStream.deliveryStreamArn),
          }),
        ],
      },
      Roles: [stack.resolve(role.roleName)],
    });
  });

  test('grantPutRecords provides PutRecord* access to stream', () => {
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    const deliveryStream = new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
    });

    deliveryStream.grantPutRecords(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          Match.objectLike({
            Action: [
              'firehose:PutRecord',
              'firehose:PutRecordBatch',
            ],
            Resource: stack.resolve(deliveryStream.deliveryStreamArn),
          }),
        ],
      },
      Roles: [stack.resolve(role.roleName)],
    });
  });

  test('dependables supplied from destination are depended on by just the CFN resource', () => {
    const dependableId = stack.resolve((Node.of(dependable).defaultChild as cdk.CfnResource).logicalId);

    new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
    });

    Template.fromStack(stack).hasResource('AWS::KinesisFirehose::DeliveryStream', {
      DependsOn: [dependableId],
    });
    Template.fromStack(stack).hasResource('AWS::IAM::Role', {
      DependsOn: Match.absent(),
    });
  });

  test('creating new stream should return IAM role when calling getter for grantPrincipal (backwards compatibility)', () => {
    const deliveryStream = new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
    });
    expect(deliveryStream.grantPrincipal).toBeInstanceOf(iam.Role);
  });

  describe('metric methods provide a Metric with configured and attached properties', () => {
    let deliveryStream: firehose.DeliveryStream;

    beforeEach(() => {
      stack = new cdk.Stack(undefined, undefined, { env: { account: '000000000000', region: 'us-west-1' } });
      deliveryStream = new firehose.DeliveryStream(stack, 'Delivery Stream', {
        destination: mockS3Destination,
      });
    });

    test('metric', () => {
      const metric = deliveryStream.metric('IncomingRecords');

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/Firehose',
        metricName: 'IncomingRecords',
        dimensions: {
          DeliveryStreamName: deliveryStream.deliveryStreamName,
        },
      });
    });

    test('metricIncomingBytes', () => {
      const metric = deliveryStream.metricIncomingBytes();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/Firehose',
        metricName: 'IncomingBytes',
        statistic: cloudwatch.Statistic.SUM,
        dimensions: {
          DeliveryStreamName: deliveryStream.deliveryStreamName,
        },
      });
    });

    test('metricIncomingRecords', () => {
      const metric = deliveryStream.metricIncomingRecords();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/Firehose',
        metricName: 'IncomingRecords',
        statistic: cloudwatch.Statistic.SUM,
        dimensions: {
          DeliveryStreamName: deliveryStream.deliveryStreamName,
        },
      });
    });

    test('metricBackupToS3Bytes', () => {
      const metric = deliveryStream.metricBackupToS3Bytes();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/Firehose',
        metricName: 'BackupToS3.Bytes',
        statistic: cloudwatch.Statistic.SUM,
        dimensions: {
          DeliveryStreamName: deliveryStream.deliveryStreamName,
        },
      });
    });

    test('metricBackupToS3DataFreshness', () => {
      const metric = deliveryStream.metricBackupToS3DataFreshness();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/Firehose',
        metricName: 'BackupToS3.DataFreshness',
        statistic: cloudwatch.Statistic.AVERAGE,
        dimensions: {
          DeliveryStreamName: deliveryStream.deliveryStreamName,
        },
      });
    });

    test('metricBackupToS3Records', () => {
      const metric = deliveryStream.metricBackupToS3Records();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/Firehose',
        metricName: 'BackupToS3.Records',
        statistic: cloudwatch.Statistic.SUM,
        dimensions: {
          DeliveryStreamName: deliveryStream.deliveryStreamName,
        },
      });
    });
  });

  test('allows connections for Firehose IP addresses using map when region not specified', () => {
    const vpc = new ec2.Vpc(stack, 'VPC');
    const securityGroup = new ec2.SecurityGroup(stack, 'Security Group', { vpc });
    const deliveryStream = new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
    });

    securityGroup.connections.allowFrom(deliveryStream, ec2.Port.allTcp());

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: [
        Match.objectLike({
          CidrIp: {
            'Fn::FindInMap': Match.arrayWith([
              {
                Ref: 'AWS::Region',
              },
              'FirehoseCidrBlock',
            ]),
          },
        }),
      ],
    });
  });

  test('allows connections for Firehose IP addresses using literal when region specified', () => {
    stack = new cdk.Stack(undefined, undefined, { env: { region: 'us-west-1' } });
    const vpc = new ec2.Vpc(stack, 'VPC');
    const securityGroup = new ec2.SecurityGroup(stack, 'Security Group', { vpc });
    const deliveryStream = new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
    });

    securityGroup.connections.allowFrom(deliveryStream, ec2.Port.allTcp());

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: [
        Match.objectLike({
          CidrIp: '13.57.135.192/27',
        }),
      ],
    });
  });

  test('only adds one Firehose IP address mapping to stack even if multiple delivery streams defined', () => {
    new firehose.DeliveryStream(stack, 'Delivery Stream 1', {
      destination: mockS3Destination,
    });
    new firehose.DeliveryStream(stack, 'Delivery Stream 2', {
      destination: mockS3Destination,
    });

    Template.fromStack(stack).hasMapping('*', {
      'af-south-1': {
        FirehoseCidrBlock: '13.244.121.224/27',
      },
    });
  });

  test('can add tags', () => {
    const deliveryStream = new firehose.DeliveryStream(stack, 'Delivery Stream', {
      destination: mockS3Destination,
    });

    cdk.Tags.of(deliveryStream).add('tagKey', 'tagValue');

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      Tags: [
        {
          Key: 'tagKey',
          Value: 'tagValue',
        },
      ],
    });
  });

  describe('importing', () => {
    test('from name', () => {
      const deliveryStream = firehose.DeliveryStream.fromDeliveryStreamName(stack, 'DeliveryStream', 'mydeliverystream');

      expect(deliveryStream.deliveryStreamName).toBe('mydeliverystream');
      expect(stack.resolve(deliveryStream.deliveryStreamArn)).toStrictEqual({
        'Fn::Join': ['', ['arn:', stack.resolve(stack.partition), ':firehose:', stack.resolve(stack.region), ':', stack.resolve(stack.account), ':deliverystream/mydeliverystream']],
      });
      expect(deliveryStream.grantPrincipal).toBeInstanceOf(iam.UnknownPrincipal);
    });

    test('from ARN', () => {
      const deliveryStream = firehose.DeliveryStream.fromDeliveryStreamArn(stack, 'DeliveryStream', 'arn:aws:firehose:xx-west-1:111122223333:deliverystream/mydeliverystream');

      expect(deliveryStream.deliveryStreamName).toBe('mydeliverystream');
      expect(deliveryStream.deliveryStreamArn).toBe('arn:aws:firehose:xx-west-1:111122223333:deliverystream/mydeliverystream');
      expect(deliveryStream.grantPrincipal).toBeInstanceOf(iam.UnknownPrincipal);
    });

    test('from attributes (just name)', () => {
      const deliveryStream = firehose.DeliveryStream.fromDeliveryStreamAttributes(stack, 'DeliveryStream', { deliveryStreamName: 'mydeliverystream' });

      expect(deliveryStream.deliveryStreamName).toBe('mydeliverystream');
      expect(stack.resolve(deliveryStream.deliveryStreamArn)).toStrictEqual({
        'Fn::Join': ['', ['arn:', stack.resolve(stack.partition), ':firehose:', stack.resolve(stack.region), ':', stack.resolve(stack.account), ':deliverystream/mydeliverystream']],
      });
      expect(deliveryStream.grantPrincipal).toBeInstanceOf(iam.UnknownPrincipal);
    });

    test('from attributes (just ARN)', () => {
      const deliveryStream = firehose.DeliveryStream.fromDeliveryStreamAttributes(stack, 'DeliveryStream', { deliveryStreamArn: 'arn:aws:firehose:xx-west-1:111122223333:deliverystream/mydeliverystream' });

      expect(deliveryStream.deliveryStreamName).toBe('mydeliverystream');
      expect(deliveryStream.deliveryStreamArn).toBe('arn:aws:firehose:xx-west-1:111122223333:deliverystream/mydeliverystream');
      expect(deliveryStream.grantPrincipal).toBeInstanceOf(iam.UnknownPrincipal);
    });

    test('from attributes (with role)', () => {
      const role = iam.Role.fromRoleArn(stack, 'Delivery Stream Role', 'arn:aws:iam::111122223333:role/DeliveryStreamRole');
      const deliveryStream = firehose.DeliveryStream.fromDeliveryStreamAttributes(stack, 'DeliveryStream', { deliveryStreamName: 'mydeliverystream', role });

      expect(deliveryStream.deliveryStreamName).toBe('mydeliverystream');
      expect(stack.resolve(deliveryStream.deliveryStreamArn)).toStrictEqual({
        'Fn::Join': ['', ['arn:', stack.resolve(stack.partition), ':firehose:', stack.resolve(stack.region), ':', stack.resolve(stack.account), ':deliverystream/mydeliverystream']],
      });
      expect(deliveryStream.grantPrincipal).toBe(role);
    });

    test('throws when malformatted ARN', () => {
      expect(() => firehose.DeliveryStream.fromDeliveryStreamAttributes(stack, 'DeliveryStream', { deliveryStreamArn: 'arn:aws:firehose:xx-west-1:111122223333:deliverystream/' }))
        .toThrow("No delivery stream name found in ARN: 'arn:aws:firehose:xx-west-1:111122223333:deliverystream/'");
    });

    test('throws when without name or ARN', () => {
      expect(() => firehose.DeliveryStream.fromDeliveryStreamAttributes(stack, 'DeliveryStream', {}))
        .toThrow('Either deliveryStreamName or deliveryStreamArn must be provided in DeliveryStreamAttributes');
    });
  });
});
