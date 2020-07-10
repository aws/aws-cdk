import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as elbv2 from '../../lib';
import { FakeSelfRegisteringTarget } from '../helpers';

export = {
  'Empty target Group without type still requires a VPC'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');

    // WHEN
    new elbv2.ApplicationTargetGroup(stack, 'LB', {});

    // THEN
    test.throws(() => {
      app.synth();
    }, /'vpc' is required for a non-Lambda TargetGroup/);

    test.done();
  },

  'Can add self-registering target to imported TargetGroup'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // WHEN
    const tg = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, 'TG', {
      targetGroupArn: 'arn',
    });
    tg.addTarget(new FakeSelfRegisteringTarget(stack, 'Target', vpc));

    // THEN
    test.done();
  },

  'Cannot add direct target to imported TargetGroup'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const tg = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, 'TG', {
      targetGroupArn: 'arn',
    });

    // WHEN
    test.throws(() => {
      tg.addTarget(new elbv2.InstanceTarget('i-1234'));
    }, /Cannot add a non-self registering target to an imported TargetGroup/);

    test.done();
  },

  'HealthCheck fields set if provided'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const vpc = new ec2.Vpc(stack, 'VPC', {});
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', {vpc});
    const listener = new elbv2.ApplicationListener(stack, 'Listener', {
      port: 80,
      loadBalancer: alb,
      open: false,
    });

    // WHEN
    const ipTarget = new elbv2.IpTarget('10.10.12.12');
    listener.addTargets('TargetGroup', {
      targets: [ipTarget],
      port: 80,
      healthCheck: {
        enabled: true,
        healthyHttpCodes: '255',
        interval: cdk.Duration.seconds(255),
        timeout: cdk.Duration.seconds(192),
        healthyThresholdCount: 29,
        unhealthyThresholdCount: 27,
        path: '/arbitrary',
      },
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      HealthCheckEnabled: true,
      HealthCheckIntervalSeconds: 255,
      HealthCheckPath: '/arbitrary',
      HealthCheckTimeoutSeconds: 192,
      HealthyThresholdCount: 29,
      Matcher: {
        HttpCode: '255',
      },
      Port: 80,
      UnhealthyThresholdCount: 27,
    }));

    test.done();
  },
};
