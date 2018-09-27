import { expect, haveResource } from '@aws-cdk/assert';
import { CidrIPv4, Connections, VpcNetwork } from '@aws-cdk/aws-ec2';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { ILoadBalancerTarget, LoadBalancer, LoadBalancingProtocol } from '../lib';

export = {
  'test specifying nonstandard port works'(test: Test) {
    const stack = new Stack(undefined, undefined, { env: { account: '1234', region: 'test' }});
    stack.setContext('availability-zones:1234:test', ['test-1a', 'test-1b']);
    const vpc = new VpcNetwork(stack, 'VCP');

    const lb = new LoadBalancer(stack, 'LB', { vpc });

    lb.addListener({
      externalProtocol: LoadBalancingProtocol.Http,
      externalPort: 8080,
      internalProtocol: LoadBalancingProtocol.Http,
      internalPort: 8080,
    });

    expect(stack).to(haveResource("AWS::ElasticLoadBalancing::LoadBalancer", {
      Listeners: [{
        InstancePort: "8080",
        InstanceProtocol: "http",
        LoadBalancerPort: "8080",
        Protocol: "http"
      }]
    }));

    test.done();
  },

  'add a health check'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new VpcNetwork(stack, 'VCP');

    // WHEN
    new LoadBalancer(stack, 'LB', {
      vpc,
      healthCheck: {
        interval: 60,
        path: '/ping',
        protocol: LoadBalancingProtocol.Https,
        port: 443,
      }
    });

    // THEN
    expect(stack).to(haveResource("AWS::ElasticLoadBalancing::LoadBalancer", {
      HealthCheck: {
        HealthyThreshold: "2",
        Interval: "60",
        Target: "HTTPS:443/ping",
        Timeout: "5",
        UnhealthyThreshold: "5"
      },
    }));

    test.done();
  },

  'add a listener and load balancing target'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new VpcNetwork(stack, 'VCP');
    const elb = new LoadBalancer(stack, 'LB', {
      vpc,
      healthCheck: {
        interval: 60,
        path: '/ping',
        protocol: LoadBalancingProtocol.Https,
        port: 443,
      }
    });

    // WHEN
    elb.addListener({ externalPort: 80, internalPort: 8080 });
    elb.addTarget(new FakeTarget());

    // THEN: at the very least it added a security group rule for the backend
    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          CidrIp: "666.666.666.666/666",
          FromPort: 8080,
          IpProtocol: "tcp",
          ToPort: 8080
        }
      ],
    }));

    test.done();
  }
};

class FakeTarget implements ILoadBalancerTarget {
  public readonly connections = new Connections({
    securityGroupRule: new CidrIPv4('666.666.666.666/666')
  });

  public attachToClassicLB(_loadBalancer: LoadBalancer): void {
    // Nothing to do. Normally we set a property on ourselves so
    // our instances know to bind to the LB on startup.
  }
}
