
import { countResources, haveResource, expect } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Test } from 'nodeunit';
import { Vpc, VpcFlowLog, VpcFlowLogDestinationType } from '../lib';

export = {
  "with cloudwatch logs as the destination and all the defaults set, it successfully creates all the resources"(test: Test) {
    const stack = getTestStack();

    new VpcFlowLog(stack, 'FlowLogs', {
      resourceType: {
        networkInterface: 'eni-123455'
      }
    });

    expect(stack).to(haveResource('AWS::EC2::FlowLog', {
      ResourceType: 'NetworkInterface',
      TrafficType: 'ALL',
      ResourceId: 'eni-123455',
      DeliverLogsPermissionArn: {
        "Fn::GetAtt": [
          "FlowLogsIAMRoleF18F4209",
          "Arn"
        ]
      },
      LogGroupName: {
        Ref: "FlowLogsLogGroup9853A85F"
      },
    }));

    expect(stack).to(countResources("AWS::Logs::LogGroup", 1));
    expect(stack).to(countResources("AWS::IAM::Role", 1));
    expect(stack).notTo(haveResource("AWS::S3::Bucket"));
    test.done();
  },
  "with s3 as the destination and all the defaults set, it successfully creates all the resources"(test: Test) {
    const stack = getTestStack();

    new VpcFlowLog(stack, 'FlowLogs', {
      resourceType: {
        networkInterface: 'eni-123456'
      },
      destinationType: VpcFlowLogDestinationType.S3
    });

    expect(stack).to(haveResource("AWS::EC2::FlowLog", {
      ResourceType: 'NetworkInterface',
      TrafficType: 'ALL',
      ResourceId: 'eni-123456',
      LogDestination: {
        "Fn::GetAtt": [
          "FlowLogsS3Bucket274C7752",
          "Arn"
        ]
      }
    }));
    expect(stack).notTo(haveResource("AWS::Logs::LogGroup"));
    expect(stack).notTo(haveResource("AWS::IAM::Role"));
    expect(stack).to(countResources("AWS::S3::Bucket", 1));
    test.done();

  },
  'create with vpc'(test: Test) {
    const stack = getTestStack();

    new Vpc(stack, 'VPC', {
      flowLogs: {
        'vpcFlowLogs': {}
      }
    });


    expect(stack).to(haveResource("AWS::EC2::VPC"));
    expect(stack).to(haveResource("AWS::EC2::FlowLog", {
      ResourceType: 'VPC',
      TrafficType: 'ALL',
      ResourceId: {
        Ref: 'VPCB9E5F0B4'
      },
      DeliverLogsPermissionArn: {
        "Fn::GetAtt": [
          "VPCvpcFlowLogsIAMRole6FD8C617",
          "Arn"
        ]
      },
      LogGroupName: {
        Ref: "VPCvpcFlowLogsLogGroup11919A88"
      }
    }));
    test.done();

  },
  'add to vpc'(test: Test) {
    const stack = getTestStack();

    const vpc = new Vpc(stack, 'VPC');
    vpc.addFlowLog('FlowLogs', {});

    expect(stack).to(haveResource("AWS::EC2::VPC"));
    expect(stack).to(haveResource("AWS::EC2::FlowLog", {
      ResourceType: 'VPC',
      TrafficType: 'ALL',
      ResourceId: {
        Ref: 'VPCB9E5F0B4'
      },
      DeliverLogsPermissionArn: {
        "Fn::GetAtt": [
          "VPCFlowLogsIAMRole55343234",
          "Arn"
        ]
      },
      LogGroupName: {
        Ref: "VPCFlowLogsLogGroupF48E1B0A"
      }
    }));
    test.done();

  },
  'must specify resourceType'(test: Test) {
    const stack = getTestStack();

    test.throws(() => {
      new VpcFlowLog(stack, 'FlowLogs', {
        resourceType: {}
      });

    }, /Must specify/);

    test.done();
  },
  'should not specify both s3Bucket and iamRole'(test: Test) {
    const stack = getTestStack();
    const s3 = new Bucket(stack, 'S3');
    const role = new Role(stack, 'Role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com')
    });

    test.throws(() => {
      new VpcFlowLog(stack, 'FlowLogs', {
        resourceType: {
          networkInterface: 'eni-123456'
        },
        s3Bucket: s3,
        iamRole: role
      });

    }, /IAM role should not/);

    test.done();
  },
  'must specify destinationType of S3 if s3Bucket is provided'(test: Test) {
    const stack = getTestStack();
    const s3 = new Bucket(stack, 'S3');

    test.throws(() => {
      new VpcFlowLog(stack, 'FlowLogs', {
        resourceType: {
          networkInterface: 'eni-123456'
        },
        s3Bucket: s3
      });

    }, /destinationType must be set/);

    test.done();
  }
}

function getTestStack(): Stack {
  return new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}
