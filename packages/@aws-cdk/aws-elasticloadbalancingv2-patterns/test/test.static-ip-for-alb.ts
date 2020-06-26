import { expect, haveResource } from '@aws-cdk/assert';
import {Vpc} from '@aws-cdk/aws-ec2';
import {ApplicationLoadBalancer} from '@aws-cdk/aws-elasticloadbalancingv2';
import {Stack} from '@aws-cdk/core';
import { Test } from 'nodeunit';
import {StaticIpForAlb} from '../lib';

export = {
  'static ip for alb with default values'(test: Test) {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', {
      env: {
        region: 'us-east-1',
        account: '123456789012',
      },
    });
    const vpc = new Vpc(stack, 'VPC', {});
    const alb = new ApplicationLoadBalancer(stack, 'ALB', {
      vpc,
    });

    // WHEN
    new StaticIpForAlb(stack, 'Sync', {
      applicationLoadBalancer: alb,
    });

    // THEN

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: 'internal',
      Subnets: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
        {
          Ref: 'VPCPrivateSubnet3Subnet3EDCD457',
        },
      ],
      Type: 'network',
    }));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Port: 443,
      Protocol: 'TCP',
      TargetType: 'ip',
      VpcId: {
        Ref: 'VPCB9E5F0B4',
      },
    }));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          TargetGroupArn: {
            Ref: 'SyncNLBTargetGroup43F57549',
          },
          Type: 'forward',
        },
      ],
      LoadBalancerArn: {
        Ref: 'SyncNLB623AB93B',
      },
      Port: 443,
      Protocol: 'TCP',
    }));

    expect(stack).to(haveResource('AWS::S3::Bucket', {
    }));

    expect(stack).to(haveResource('AWS::IAM::ManagedPolicy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3:GetObject',
              's3:PutObject',
              'logs:CreateLogStream',
              'elasticloadbalancing:RegisterTargets',
              'elasticloadbalancing:DeregisterTargets',
            ],
            Effect: 'Allow',
            Resource: [
              'arn:aws:logs:*:*:log-group:*',
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'SyncAlbIpChangeTrackingBucket2E6B7685',
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
              {
                Ref: 'SyncNLBTargetGroup43F57549',
              },
            ],
          },
          {
            Action: [
              'cloudwatch:PutMetricData',
              'elasticloadbalancing:DescribeTargetHealth',
              'logs:CreateLogGroup',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: 'logs:PutLogEvents',
            Effect: 'Allow',
            Resource: 'arn:aws:logs:*:*:log-group:*:log-stream:*',
          },
        ],
        Version: '2012-10-17',
      },
    }));

    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          Ref: 'SyncLambdaPolicyFB534D77',
        },
      ],
    }));

    expect(stack).to(haveResource('AWS::Lambda::Function', {
      Handler: '__init__.lambda_handler',
      Role: {
        'Fn::GetAtt': [
          'SyncIpSyncFunctionRoleDA93150A',
          'Arn',
        ],
      },
      Runtime: 'python3.8',
      Description: 'Syncs ip addresses of the target ALB to the NLB target group',
      Environment: {
        Variables: {
          S3_BUCKET: {
            Ref: 'SyncAlbIpChangeTrackingBucket2E6B7685',
          },
          ALB_DNS_NAME: {
            'Fn::GetAtt': [
              'ALBAEE750D2',
              'DNSName',
            ],
          },
          MAX_LOOKUP_PER_INVOCATION: '50',
          CW_METRIC_FLAG_IP_COUNT: 'True',
          NLB_TG_ARN: {
            Ref: 'SyncNLBTargetGroup43F57549',
          },
          ALB_LISTENER: '443',
          INVOCATIONS_BEFORE_DEREGISTRATION: '3',
        },
      },
      MemorySize: 128,
      Timeout: 300,
    }));
    test.done();
  },

  'static ip for alb with specified values'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC', {});
    const alb = new ApplicationLoadBalancer(stack, 'ALB', {
      vpc,
    });

    // WHEN
    new StaticIpForAlb(stack, 'Sync', {
      applicationLoadBalancer: alb,
      albPort: 80,
      internetFacing: true,
    });

    // THEN
    test.done();
  },
};
