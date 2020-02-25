import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import { Metric } from '@aws-cdk/aws-cloudwatch';
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
      ],
      Type: "application"
    }));

    test.done();
  },

  'internet facing load balancer has dependency on IGW'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.ApplicationLoadBalancer(stack, 'LB', {
      vpc,
      internetFacing: true,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      DependsOn: [
        'StackPublicSubnet1DefaultRoute16154E3D',
        'StackPublicSubnet2DefaultRoute0319539B',
      ]
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'Trivial construction: internal'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Scheme: "internal",
      Subnets: [
        { Ref: "StackPrivateSubnet1Subnet47AC2BC7" },
        { Ref: "StackPrivateSubnet2SubnetA2F8EDD8" },
      ],
      Type: "application"
    }));

    test.done();
  },

  'Attributes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.ApplicationLoadBalancer(stack, 'LB', {
      vpc,
      deletionProtection: true,
      http2Enabled: false,
      idleTimeout: cdk.Duration.seconds(1000),
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
    const stack = new cdk.Stack(undefined, undefined, { env: { region: 'us-east-1' } });
    const vpc = new ec2.Vpc(stack, 'Stack');
    const bucket = new s3.Bucket(stack, 'AccessLoggingBucket');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.logAccessLogs(bucket);

    // THEN

    // verify that the LB attributes reference the bucket
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

    // verify the bucket policy allows the ALB to put objects in the bucket
    expect(stack).to(haveResource('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ["s3:PutObject*", "s3:Abort*"],
            Effect: 'Allow',
            Principal: { AWS: { "Fn::Join": ["", ["arn:", { Ref: "AWS::Partition" }, ":iam::127311923021:root"]] } },
            Resource: {
              "Fn::Join": ["", [{ "Fn::GetAtt": ["AccessLoggingBucketA6D88F29", "Arn"] }, "/AWSLogs/",
              { Ref: "AWS::AccountId" }, "/*"]]
            }
          }
        ]
      }
    }));

    // verify the ALB depends on the bucket *and* the bucket policy
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      DependsOn: ['AccessLoggingBucketPolicy700D7CC6', 'AccessLoggingBucketA6D88F29']
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'access logging with prefix'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, undefined, { env: { region: 'us-east-1' } });
    const vpc = new ec2.Vpc(stack, 'Stack');
    const bucket = new s3.Bucket(stack, 'AccessLoggingBucket');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.logAccessLogs(bucket, 'prefix-of-access-logs');

    // THEN
    // verify that the LB attributes reference the bucket
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      LoadBalancerAttributes: [
        {
          Key: "access_logs.s3.enabled",
          Value: "true"
        },
        {
          Key: "access_logs.s3.bucket",
          Value: { Ref: "AccessLoggingBucketA6D88F29" }
        },
        {
          Key: "access_logs.s3.prefix",
          Value: "prefix-of-access-logs"
        }
      ],
    }));

    // verify the bucket policy allows the ALB to put objects in the bucket
    expect(stack).to(haveResource('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ["s3:PutObject*", "s3:Abort*"],
            Effect: 'Allow',
            Principal: { AWS: { "Fn::Join": ["", ["arn:", { Ref: "AWS::Partition" }, ":iam::127311923021:root"]] } },
            Resource: {
              "Fn::Join": ["", [{ "Fn::GetAtt": ["AccessLoggingBucketA6D88F29", "Arn"] }, "/prefix-of-access-logs/AWSLogs/",
              { Ref: "AWS::AccountId" }, "/*"]]
            }
          }
        ]
      }
    }));

    test.done();
  },

  'Exercise metrics'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    const metrics = new Array<Metric>();
    metrics.push(lb.metricActiveConnectionCount());
    metrics.push(lb.metricClientTlsNegotiationErrorCount());
    metrics.push(lb.metricConsumedLCUs());
    metrics.push(lb.metricElbAuthError());
    metrics.push(lb.metricElbAuthFailure());
    metrics.push(lb.metricElbAuthLatency());
    metrics.push(lb.metricElbAuthSuccess());
    metrics.push(lb.metricHttpCodeElb(elbv2.HttpCodeElb.ELB_3XX_COUNT));
    metrics.push(lb.metricHttpCodeTarget(elbv2.HttpCodeTarget.TARGET_3XX_COUNT));
    metrics.push(lb.metricHttpFixedResponseCount());
    metrics.push(lb.metricHttpRedirectCount());
    metrics.push(lb.metricHttpRedirectUrlLimitExceededCount());
    metrics.push(lb.metricIpv6ProcessedBytes());
    metrics.push(lb.metricIpv6RequestCount());
    metrics.push(lb.metricNewConnectionCount());
    metrics.push(lb.metricProcessedBytes());
    metrics.push(lb.metricRejectedConnectionCount());
    metrics.push(lb.metricRequestCount());
    metrics.push(lb.metricRuleEvaluations());
    metrics.push(lb.metricTargetConnectionErrorCount());
    metrics.push(lb.metricTargetResponseTime());
    metrics.push(lb.metricTargetTLSNegotiationErrorCount());

    for (const metric of metrics) {
      test.equal('AWS/ApplicationELB', metric.namespace);
      test.deepEqual(stack.resolve(metric.dimensions), {
        LoadBalancer: { 'Fn::GetAtt': ['LB8A12904C', 'LoadBalancerFullName'] }
      });
    }

    test.done();
  },

  'loadBalancerName'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.ApplicationLoadBalancer(stack, 'ALB', {
      loadBalancerName: 'myLoadBalancer',
      vpc
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Name: 'myLoadBalancer'
    }));
    test.done();
  },

  'imported load balancer with no vpc throws error when calling addTargets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const albArn = 'myArn';
    const sg = new ec2.SecurityGroup(stack, "sg", {
      vpc,
      securityGroupName: 'mySg',
    });
    const alb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ALB', {
      loadBalancerArn: albArn,
      securityGroupId: sg.securityGroupId,
    });

    // WHEN
    const listener = alb.addListener('Listener', { port: 80 });
    test.throws(() => listener.addTargets('Targets', {port: 8080}));

    test.done();
  },

  'imported load balancer with vpc does not throw error when calling addTargets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const albArn = 'MyArn';
    const sg = new ec2.SecurityGroup(stack, 'sg', {
      vpc,
      securityGroupName: 'mySg',
    });
    const alb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ALB', {
      loadBalancerArn: albArn,
      securityGroupId: sg.securityGroupId,
      vpc,
    });

    // WHEN
    const listener = alb.addListener('Listener', { port: 80 });
    test.doesNotThrow(() => listener.addTargets('Targets', {port: 8080}));

    test.done();
  },
};
