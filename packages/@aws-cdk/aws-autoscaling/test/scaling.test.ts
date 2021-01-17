import { expect, haveResource } from '@aws-cdk/assert';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as autoscaling from '../lib';

nodeunitShim({
  'target tracking policies': {
    'cpu utilization'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const fixture = new ASGFixture(stack, 'Fixture');

      // WHEN
      fixture.asg.scaleOnCpuUtilization('ScaleCpu', {
        targetUtilizationPercent: 30,
      });

      // THEN
      expect(stack).to(haveResource('AWS::AutoScaling::ScalingPolicy', {
        PolicyType: 'TargetTrackingScaling',
        TargetTrackingConfiguration: {
          PredefinedMetricSpecification: { PredefinedMetricType: 'ASGAverageCPUUtilization' },
          TargetValue: 30,
        },
      }));

      test.done();
    },

    'network ingress'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const fixture = new ASGFixture(stack, 'Fixture');

      // WHEN
      fixture.asg.scaleOnIncomingBytes('ScaleNetwork', {
        targetBytesPerSecond: 100,
      });

      // THEN
      expect(stack).to(haveResource('AWS::AutoScaling::ScalingPolicy', {
        PolicyType: 'TargetTrackingScaling',
        TargetTrackingConfiguration: {
          PredefinedMetricSpecification: { PredefinedMetricType: 'ASGAverageNetworkIn' },
          TargetValue: 100,
        },
      }));

      test.done();
    },

    'network egress'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const fixture = new ASGFixture(stack, 'Fixture');

      // WHEN
      fixture.asg.scaleOnOutgoingBytes('ScaleNetwork', {
        targetBytesPerSecond: 100,
      });

      // THEN
      expect(stack).to(haveResource('AWS::AutoScaling::ScalingPolicy', {
        PolicyType: 'TargetTrackingScaling',
        TargetTrackingConfiguration: {
          PredefinedMetricSpecification: { PredefinedMetricType: 'ASGAverageNetworkOut' },
          TargetValue: 100,
        },
      }));

      test.done();
    },

    'request count per second'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const fixture = new ASGFixture(stack, 'Fixture');
      const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc: fixture.vpc });
      const listener = alb.addListener('Listener', { port: 80 });
      listener.addTargets('Targets', {
        port: 80,
        targets: [fixture.asg],
      });

      // WHEN
      fixture.asg.scaleOnRequestCount('ScaleRequest', {
        targetRequestsPerSecond: 10,
      });

      // THEN
      const arnParts = {
        'Fn::Split': [
          '/',
          { Ref: 'ALBListener3B99FF85' },
        ],
      };

      expect(stack).to(haveResource('AWS::AutoScaling::ScalingPolicy', {
        PolicyType: 'TargetTrackingScaling',
        TargetTrackingConfiguration: {
          TargetValue: 600,
          PredefinedMetricSpecification: {
            PredefinedMetricType: 'ALBRequestCountPerTarget',
            ResourceLabel: {
              'Fn::Join': ['', [
                { 'Fn::Select': [1, arnParts] },
                '/',
                { 'Fn::Select': [2, arnParts] },
                '/',
                { 'Fn::Select': [3, arnParts] },
                '/',
                { 'Fn::GetAtt': ['ALBListenerTargetsGroup01D7716A', 'TargetGroupFullName'] },
              ]],
            },
          },
        },
      }));

      test.done();
    },

    'request count per minute'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const fixture = new ASGFixture(stack, 'Fixture');
      const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc: fixture.vpc });
      const listener = alb.addListener('Listener', { port: 80 });
      listener.addTargets('Targets', {
        port: 80,
        targets: [fixture.asg],
      });

      // WHEN
      fixture.asg.scaleOnRequestCount('ScaleRequest', {
        targetRequestsPerMinute: 10,
      });

      // THEN
      const arnParts = {
        'Fn::Split': [
          '/',
          { Ref: 'ALBListener3B99FF85' },
        ],
      };

      expect(stack).to(haveResource('AWS::AutoScaling::ScalingPolicy', {
        PolicyType: 'TargetTrackingScaling',
        TargetTrackingConfiguration: {
          TargetValue: 10,
          PredefinedMetricSpecification: {
            PredefinedMetricType: 'ALBRequestCountPerTarget',
            ResourceLabel: {
              'Fn::Join': ['', [
                { 'Fn::Select': [1, arnParts] },
                '/',
                { 'Fn::Select': [2, arnParts] },
                '/',
                { 'Fn::Select': [3, arnParts] },
                '/',
                { 'Fn::GetAtt': ['ALBListenerTargetsGroup01D7716A', 'TargetGroupFullName'] },
              ]],
            },
          },
        },
      }));

      test.done();
    },

    'custom metric'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const fixture = new ASGFixture(stack, 'Fixture');

      // WHEN
      fixture.asg.scaleToTrackMetric('Metric', {
        metric: new cloudwatch.Metric({
          metricName: 'Henk',
          namespace: 'Test',
          dimensions: {
            Mustache: 'Bushy',
          },
        }),
        targetValue: 2,
      });

      // THEN
      expect(stack).to(haveResource('AWS::AutoScaling::ScalingPolicy', {
        PolicyType: 'TargetTrackingScaling',
        TargetTrackingConfiguration: {
          CustomizedMetricSpecification: {
            Dimensions: [{ Name: 'Mustache', Value: 'Bushy' }],
            MetricName: 'Henk',
            Namespace: 'Test',
            Statistic: 'Average',
          },
          TargetValue: 2,
        },
      }));

      test.done();
    },
  },

  'step scaling'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fixture = new ASGFixture(stack, 'Fixture');

    // WHEN
    fixture.asg.scaleOnMetric('Metric', {
      metric: new cloudwatch.Metric({
        metricName: 'Legs',
        namespace: 'Henk',
        dimensions: { Mustache: 'Bushy' },
      }),
      // Adjust the number of legs to be closer to 2
      scalingSteps: [
        { lower: 0, upper: 2, change: +1 },
        { lower: 3, upper: 5, change: -1 },
        { lower: 5, change: -2 }, // Must work harder to remove legs
      ],
    });

    // THEN: scaling in policy
    expect(stack).to(haveResource('AWS::AutoScaling::ScalingPolicy', {
      MetricAggregationType: 'Average',
      PolicyType: 'StepScaling',
      StepAdjustments: [
        {
          MetricIntervalLowerBound: 0,
          MetricIntervalUpperBound: 2,
          ScalingAdjustment: -1,
        },
        {
          MetricIntervalLowerBound: 2,
          ScalingAdjustment: -2,
        },
      ],
    }));

    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      Threshold: 3,
      AlarmActions: [{ Ref: 'FixtureASGMetricUpperPolicyC464CAFB' }],
      AlarmDescription: 'Upper threshold scaling alarm',
    }));

    // THEN: scaling out policy
    expect(stack).to(haveResource('AWS::AutoScaling::ScalingPolicy', {
      MetricAggregationType: 'Average',
      PolicyType: 'StepScaling',
      StepAdjustments: [
        {
          MetricIntervalUpperBound: 0,
          ScalingAdjustment: 1,
        },
      ],
    }));

    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'LessThanOrEqualToThreshold',
      Threshold: 2,
      AlarmActions: [{ Ref: 'FixtureASGMetricLowerPolicy4A1CDE42' }],
      AlarmDescription: 'Lower threshold scaling alarm',
    }));

    test.done();
  },
});

class ASGFixture extends Construct {
  public readonly vpc: ec2.Vpc;
  public readonly asg: autoscaling.AutoScalingGroup;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, 'VPC');
    this.asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc: this.vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
    });
  }
}
