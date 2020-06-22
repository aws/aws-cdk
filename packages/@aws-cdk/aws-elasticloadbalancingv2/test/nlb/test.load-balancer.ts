import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as elbv2 from '../../lib';

export = {
  'Trivial construction: internet facing'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', {
      vpc,
      internetFacing: true,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: 'internet-facing',
      Subnets: [
        { Ref: 'StackPublicSubnet1Subnet0AD81D22' },
        { Ref: 'StackPublicSubnet2Subnet3C7D2288' },
      ],
      Type: 'network',
    }));

    test.done();
  },

  'Trivial construction: internal'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: 'internal',
      Subnets: [
        { Ref: 'StackPrivateSubnet1Subnet47AC2BC7' },
        { Ref: 'StackPrivateSubnet2SubnetA2F8EDD8' },
      ],
      Type: 'network',
    }));

    test.done();
  },

  'Attributes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', {
      vpc,
      crossZoneEnabled: true,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      LoadBalancerAttributes: [
        {
          Key: 'load_balancing.cross_zone.enabled',
          Value: 'true',
        },
      ],
    }));

    test.done();
  },

  'Access logging'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, undefined, { env: { region: 'us-east-1' } });
    const vpc = new ec2.Vpc(stack, 'Stack');
    const bucket = new s3.Bucket(stack, 'AccessLoggingBucket');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.logAccessLogs(bucket);

    // THEN

    // verify that the LB attributes reference the bucket
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      LoadBalancerAttributes: [
        {
          Key: 'access_logs.s3.enabled',
          Value: 'true',
        },
        {
          Key: 'access_logs.s3.bucket',
          Value: { Ref: 'AccessLoggingBucketA6D88F29' },
        },
      ],
    }));

    // verify the bucket policy allows the ALB to put objects in the bucket
    expect(stack).to(haveResource('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ['s3:PutObject*', 's3:Abort*'],
            Effect: 'Allow',
            Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::127311923021:root']] } },
            Resource: {
              'Fn::Join': ['', [{ 'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'] }, '/AWSLogs/',
                { Ref: 'AWS::AccountId' }, '/*']],
            },
          },
          {
            Action: 's3:PutObject',
            Condition: { StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' }},
            Effect: 'Allow',
            Principal: { Service: 'delivery.logs.amazonaws.com' },
            Resource: {
              'Fn::Join': ['', [{ 'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'] }, '/AWSLogs/',
                { Ref: 'AWS::AccountId' }, '/*']],
            },
          },
          {
            Action: 's3:GetBucketAcl',
            Effect: 'Allow',
            Principal: { Service: 'delivery.logs.amazonaws.com' },
            Resource: {
              'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'],
            },
          },
        ],
      },
    }));

    // verify the ALB depends on the bucket *and* the bucket policy
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      DependsOn: ['AccessLoggingBucketPolicy700D7CC6', 'AccessLoggingBucketA6D88F29'],
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'access logging with prefix'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, undefined, { env: { region: 'us-east-1' } });
    const vpc = new ec2.Vpc(stack, 'Stack');
    const bucket = new s3.Bucket(stack, 'AccessLoggingBucket');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.logAccessLogs(bucket, 'prefix-of-access-logs');

    // THEN
    // verify that the LB attributes reference the bucket
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      LoadBalancerAttributes: [
        {
          Key: 'access_logs.s3.enabled',
          Value: 'true',
        },
        {
          Key: 'access_logs.s3.bucket',
          Value: { Ref: 'AccessLoggingBucketA6D88F29' },
        },
        {
          Key: 'access_logs.s3.prefix',
          Value: 'prefix-of-access-logs',
        },
      ],
    }));

    // verify the bucket policy allows the ALB to put objects in the bucket
    expect(stack).to(haveResource('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ['s3:PutObject*', 's3:Abort*'],
            Effect: 'Allow',
            Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::127311923021:root']] } },
            Resource: {
              'Fn::Join': ['', [{ 'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'] }, '/prefix-of-access-logs/AWSLogs/',
                { Ref: 'AWS::AccountId' }, '/*']],
            },
          },
          {
            Action: 's3:PutObject',
            Condition: { StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' }},
            Effect: 'Allow',
            Principal: { Service: 'delivery.logs.amazonaws.com' },
            Resource: {
              'Fn::Join': ['', [{ 'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'] }, '/prefix-of-access-logs/AWSLogs/',
                { Ref: 'AWS::AccountId' }, '/*']],
            },
          },
          {
            Action: 's3:GetBucketAcl',
            Effect: 'Allow',
            Principal: { Service: 'delivery.logs.amazonaws.com' },
            Resource: {
              'Fn::GetAtt': ['AccessLoggingBucketA6D88F29', 'Arn'],
            },
          },
        ],
      },
    }));

    test.done();
  },

  'loadBalancerName'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'ALB', {
      loadBalancerName: 'myLoadBalancer',
      vpc,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Name: 'myLoadBalancer',
    }));
    test.done();
  },

  'imported network load balancer with no vpc specified throws error when calling addTargets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const nlbArn = 'arn:aws:elasticloadbalancing::000000000000::dummyloadbalancer';
    const nlb = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack, 'NLB', {
      loadBalancerArn: nlbArn,
    });
    // WHEN
    const listener = nlb.addListener('Listener', {port: 80});
    test.throws(() => listener.addTargets('targetgroup', {port: 8080}));

    test.done();
  },

  'imported network load balancer with vpc does not throw error when calling addTargets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const nlbArn = 'arn:aws:elasticloadbalancing::000000000000::dummyloadbalancer';
    const nlb = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack, 'NLB', {
      loadBalancerArn: nlbArn,
      vpc,
    });
    // WHEN
    const listener = nlb.addListener('Listener', {port: 80});
    test.doesNotThrow(() => listener.addTargets('targetgroup', {port: 8080}));

    test.done();
  },

  'Trivial construction: internal with Isolated subnets only'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', {
      subnetConfiguration: [{
        cidrMask: 20,
        name: 'Isolated',
        subnetType: ec2.SubnetType.ISOLATED,
      }],
    });

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', {
      vpc,
      internetFacing: false,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: 'internal',
      Subnets: [
        { Ref: 'VPCIsolatedSubnet1SubnetEBD00FC6' },
        { Ref: 'VPCIsolatedSubnet2Subnet4B1C8CAA' },
      ],
      Type: 'network',
    }));

    test.done();
  },
  'Internal with Public, Private, and Isolated subnets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', {
      subnetConfiguration: [{
        cidrMask: 24,
        name: 'Public',
        subnetType: ec2.SubnetType.PUBLIC,
      }, {
        cidrMask: 24,
        name: 'Private',
        subnetType: ec2.SubnetType.PRIVATE,
      }, {
        cidrMask: 28,
        name: 'Isolated',
        subnetType: ec2.SubnetType.ISOLATED,
      },
      ],
    });

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', {
      vpc,
      internetFacing: false,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: 'internal',
      Subnets: [
        { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
        { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
      ],
      Type: 'network',
    }));

    test.done();
  },
  'Internet-facing with Public, Private, and Isolated subnets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', {
      subnetConfiguration: [{
        cidrMask: 24,
        name: 'Public',
        subnetType: ec2.SubnetType.PUBLIC,
      }, {
        cidrMask: 24,
        name: 'Private',
        subnetType: ec2.SubnetType.PRIVATE,
      }, {
        cidrMask: 28,
        name: 'Isolated',
        subnetType: ec2.SubnetType.ISOLATED,
      },
      ],
    });

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', {
      vpc,
      internetFacing: true,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: 'internet-facing',
      Subnets: [
        { Ref: 'VPCPublicSubnet1SubnetB4246D30' },
        { Ref: 'VPCPublicSubnet2Subnet74179F39' },
      ],
      Type: 'network',
    }));

    test.done();
  },
  'Internal load balancer supplying public subnets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', {
      vpc,
      internetFacing: false,
      vpcSubnets: {subnetType: ec2.SubnetType.PUBLIC},
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: 'internal',
      Subnets: [
        { Ref: 'VPCPublicSubnet1SubnetB4246D30' },
        { Ref: 'VPCPublicSubnet2Subnet74179F39' },
      ],
      Type: 'network',
    }));

    test.done();
  },
  'Internal load balancer supplying isolated subnets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', {
      subnetConfiguration: [{
        cidrMask: 24,
        name: 'Public',
        subnetType: ec2.SubnetType.PUBLIC,
      }, {
        cidrMask: 24,
        name: 'Private',
        subnetType: ec2.SubnetType.PRIVATE,
      }, {
        cidrMask: 28,
        name: 'Isolated',
        subnetType: ec2.SubnetType.ISOLATED,
      },
      ],
    });

    // WHEN
    new elbv2.NetworkLoadBalancer(stack, 'LB', {
      vpc,
      internetFacing: false,
      vpcSubnets: {subnetType: ec2.SubnetType.ISOLATED},
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: 'internal',
      Subnets: [
        { Ref: 'VPCIsolatedSubnet1SubnetEBD00FC6' },
        { Ref: 'VPCIsolatedSubnet2Subnet4B1C8CAA' },
      ],
      Type: 'network',
    }));

    test.done();
  },
};
