import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import elbv2 = require('../../lib');

export = {
  'Trivial construction: internet facing'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'Stack');

    // WHEN
    new elbv2.ApplicationLoadBalancer(stack, 'LB', {
      vpc,
      internetFacing: true,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: "internet-facing",
      Subnets: [
        { Ref: "StackPublicSubnet1Subnet0AD81D22" },
        { Ref: "StackPublicSubnet2Subnet3C7D2288" },
        { Ref: "StackPublicSubnet3SubnetCC1055D9" }
      ],
      Type: "application"
    }));

    test.done();
  },

  'Trivial construction: internal'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'Stack');

    // WHEN
    new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: "internal",
      Subnets: [
        { Ref: "StackPrivateSubnet1Subnet47AC2BC7" },
        { Ref: "StackPrivateSubnet2SubnetA2F8EDD8" },
        { Ref: "StackPrivateSubnet3Subnet28548F2E" }
      ],
      Type: "application"
    }));

    test.done();
  },

  'Attributes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'Stack');

    // WHEN
    new elbv2.ApplicationLoadBalancer(stack, 'LB', {
      vpc,
      deletionProtection: true,
      http2Enabled: false,
      idleTimeoutSecs: 1000,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      LoadBalancerAttributes: [
        {
          Key: "deletion_protection.enabled",
          Value: "true"
        },
        {
          Key: "routing.http2.enabled",
          Value: "false"
        },
        {
          Key: "idle_timeout.timeout_seconds",
          Value: "1000"
        }
      ]
    }));

    test.done();
  },

  'Access logging'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, undefined, { env: { region: 'us-east-1' }});
    const vpc = new ec2.VpcNetwork(stack, 'Stack');
    const bucket = new s3.Bucket(stack, 'AccessLoggingBucket');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.logAccessLogs(bucket);

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      LoadBalancerAttributes: [
        {
          Key: "access_logs.s3.enabled",
          Value: "true"
        },
        {
          Key: "access_logs.s3.bucket",
          Value: { Ref: "AccessLoggingBucketA6D88F29" }
        }
      ],
    }));
    expect(stack).to(haveResource('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: [
          {
            Action: "s3:PutObject",
            Principal: { AWS: { "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":iam::127311923021:root" ] ] } },
            Resource: { "Fn::Join": [ "", [ { "Fn::GetAtt": [ "AccessLoggingBucketA6D88F29", "Arn" ] }, "/", "", "*" ] ] }
          }
        ]
      }
    }));

    test.done();
  }
};
