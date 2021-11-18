import '@aws-cdk/assert-internal/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import { FlowLog, FlowLogDestination, FlowLogResourceType, Vpc } from '../lib';

describe('vpc flow logs', () => {
  test('with defaults set, it successfully creates with cloudwatch logs destination', () => {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
    });

    expect(stack).
      toHaveResource('AWS::EC2::FlowLog', {
        ResourceType: 'NetworkInterface',
        TrafficType: 'ALL',
        ResourceId: 'eni-123455',
        DeliverLogsPermissionArn: {
          'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
        },
        LogGroupName: {
          Ref: 'FlowLogsLogGroup9853A85F',
        },
      },
      );

    expect(stack).toCountResources('AWS::Logs::LogGroup', 1);
    expect(stack).toCountResources('AWS::IAM::Role', 1);
    expect(stack).not.toHaveResource('AWS::S3::Bucket');

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

    expect(stack).toHaveResource('AWS::Logs::LogGroup', {
      RetentionInDays: 5,
    });
    expect(stack).toHaveResource('AWS::IAM::Role', {
      RoleName: 'TestName',
    });
    expect(stack).not.toHaveResource('AWS::S3::Bucket');

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

    expect(stack).not.toHaveResource('AWS::Logs::LogGroup');
    expect(stack).not.toHaveResource('AWS::IAM::Role');
    expect(stack).toHaveResource('AWS::S3::Bucket', {
      BucketName: 'testbucket',
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

    expect(stack).not.toHaveResource('AWS::Logs::LogGroup');
    expect(stack).not.toHaveResource('AWS::IAM::Role');
    expect(stack).toHaveResource('AWS::S3::Bucket', {
      BucketName: 'testbucket',
    });

  });
  test('with s3 as the destination and all the defaults set, it successfully creates all the resources', () => {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
      destination: FlowLogDestination.toS3(),
    });

    expect(stack).
      toHaveResource('AWS::EC2::FlowLog', {
        ResourceType: 'NetworkInterface',
        TrafficType: 'ALL',
        ResourceId: 'eni-123456',
        LogDestination: {
          'Fn::GetAtt': ['FlowLogsBucket87F67F60', 'Arn'],
        },
      },
      );
    expect(stack).not.toHaveResource('AWS::Logs::LogGroup');
    expect(stack).not.toHaveResource('AWS::IAM::Role');
    expect(stack).toCountResources('AWS::S3::Bucket', 1);

  });
  test('create with vpc', () => {
    const stack = getTestStack();

    new Vpc(stack, 'VPC', {
      flowLogs: {
        flowLogs: {},
      },
    });

    expect(stack).toHaveResource('AWS::EC2::VPC');
    expect(stack).
      toHaveResource('AWS::EC2::FlowLog', {
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
      },
      );

  });
  test('add to vpc', () => {
    const stack = getTestStack();

    const vpc = new Vpc(stack, 'VPC');
    vpc.addFlowLog('FlowLogs');

    expect(stack).toHaveResource('AWS::EC2::VPC');
    expect(stack).
      toHaveResource('AWS::EC2::FlowLog', {
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
      },
      );

  });
});

function getTestStack(): Stack {
  return new Stack(undefined, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });
}
