import { Template } from '@aws-cdk/assertions';
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

    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
});

function getTestStack(): Stack {
  return new Stack(undefined, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });
}
