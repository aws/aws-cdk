import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import elbv2 = require('../../lib');
import { FakeSelfRegisteringTarget } from '../helpers';

export = {
  'Trivial add listener'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'TCP',
      Port: 443
    }));

    test.done();
  },

  'Can add target groups'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443 });
    const group = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });

    // WHEN
    listener.addTargetGroups('Default', group);

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          TargetGroupArn: { Ref: "TargetGroup3D7CD9B8" },
          Type: "forward"
        }
      ],
    }));

    test.done();
  },

  'Can implicitly create target groups'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443 });

    // WHEN
    listener.addTargets('Targets', {
      port: 80,
      targets: [new elbv2.InstanceTarget('i-12345')]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          TargetGroupArn: { Ref: "LBListenerTargetsGroup76EF81E8" },
          Type: "forward"
        }
      ],
    }));
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      VpcId: { Ref: "Stack8A423254" },
      Port: 80,
      Protocol: "TCP",
      Targets: [
        { Id: "i-12345" }
      ]
    }));

    test.done();
  },

  'Enable health check for targets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443 });

    // WHEN
    const group = listener.addTargets('Group', {
      port: 80,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)]
    });
    group.configureHealthCheck({
      timeoutSeconds: 3600,
      intervalSecs: 30,
      path: '/test',
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      HealthCheckIntervalSeconds: 30,
      HealthCheckPath: "/test",
      HealthCheckTimeoutSeconds: 3600,
    }));

    test.done();
  },
};
