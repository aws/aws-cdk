import { countResources, expect, haveResource } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { FlowLog, FlowLogDestination, FlowLogResourceType, Vpc } from '../lib';

nodeunitShim({
  'with defaults set, it successfully creates with cloudwatch logs destination'(
    test: Test,
  ) {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
    });

    expect(stack).to(
      haveResource('AWS::EC2::FlowLog', {
        ResourceType: 'NetworkInterface',
        TrafficType: 'ALL',
        ResourceId: 'eni-123455',
        DeliverLogsPermissionArn: {
          'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
        },
        LogGroupName: {
          Ref: 'FlowLogsLogGroup9853A85F',
        },
      }),
    );

    expect(stack).to(countResources('AWS::Logs::LogGroup', 1));
    expect(stack).to(countResources('AWS::IAM::Role', 1));
    expect(stack).notTo(haveResource('AWS::S3::Bucket'));
    test.done();
  },
  'with cloudwatch logs as the destination, allows use of existing resources'(test: Test) {
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

    expect(stack).to(haveResource('AWS::Logs::LogGroup', {
      RetentionInDays: 5,
    }));
    expect(stack).to(haveResource('AWS::IAM::Role', {
      RoleName: 'TestName',
    }));
    expect(stack).notTo(haveResource('AWS::S3::Bucket'));
    test.done();
  },
  'with s3 as the destination, allows use of existing resources'(test: Test) {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
      destination: FlowLogDestination.toS3(
        new s3.Bucket(stack, 'TestBucket', {
          bucketName: 'testbucket',
        }),
      ),
    });

    expect(stack).notTo(haveResource('AWS::Logs::LogGroup'));
    expect(stack).notTo(haveResource('AWS::IAM::Role'));
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      BucketName: 'testbucket',
    }));
    test.done();
  },
  'with s3 as the destination, allows use of key prefix'(test: Test) {
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

    expect(stack).notTo(haveResource('AWS::Logs::LogGroup'));
    expect(stack).notTo(haveResource('AWS::IAM::Role'));
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      BucketName: 'testbucket',
    }));
    test.done();
  },
  'with s3 as the destination and all the defaults set, it successfully creates all the resources'(
    test: Test,
  ) {
    const stack = getTestStack();

    new FlowLog(stack, 'FlowLogs', {
      resourceType: FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
      destination: FlowLogDestination.toS3(),
    });

    expect(stack).to(
      haveResource('AWS::EC2::FlowLog', {
        ResourceType: 'NetworkInterface',
        TrafficType: 'ALL',
        ResourceId: 'eni-123456',
        LogDestination: {
          'Fn::GetAtt': ['FlowLogsBucket87F67F60', 'Arn'],
        },
      }),
    );
    expect(stack).notTo(haveResource('AWS::Logs::LogGroup'));
    expect(stack).notTo(haveResource('AWS::IAM::Role'));
    expect(stack).to(countResources('AWS::S3::Bucket', 1));
    test.done();
  },
  'create with vpc'(test: Test) {
    const stack = getTestStack();

    new Vpc(stack, 'VPC', {
      flowLogs: {
        flowLogs: {},
      },
    });

    expect(stack).to(haveResource('AWS::EC2::VPC'));
    expect(stack).to(
      haveResource('AWS::EC2::FlowLog', {
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
      }),
    );
    test.done();
  },
  'add to vpc'(test: Test) {
    const stack = getTestStack();

    const vpc = new Vpc(stack, 'VPC');
    vpc.addFlowLog('FlowLogs');

    expect(stack).to(haveResource('AWS::EC2::VPC'));
    expect(stack).to(
      haveResource('AWS::EC2::FlowLog', {
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
      }),
    );
    test.done();
  },
});

function getTestStack(): Stack {
  return new Stack(undefined, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });
}
