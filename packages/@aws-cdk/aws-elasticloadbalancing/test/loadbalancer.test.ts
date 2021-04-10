import { expect, haveResource } from '@aws-cdk/assert-internal';
import { Connections, Peer, SubnetType, Vpc } from '@aws-cdk/aws-ec2';
import { Duration, Stack } from '@aws-cdk/core';
import { ILoadBalancerTarget, LoadBalancer, LoadBalancingProtocol } from '../lib';

describe('tests', () => {
  test('test specifying nonstandard port works', () => {
    const stack = new Stack(undefined, undefined, { env: { account: '1234', region: 'test' } });
    stack.node.setContext('availability-zones:1234:test', ['test-1a', 'test-1b']);
    const vpc = new Vpc(stack, 'VCP');

    const lb = new LoadBalancer(stack, 'LB', { vpc });

    lb.addListener({
      externalProtocol: LoadBalancingProtocol.HTTP,
      externalPort: 8080,
      internalProtocol: LoadBalancingProtocol.HTTP,
      internalPort: 8080,
    });

    expect(stack).to(haveResource('AWS::ElasticLoadBalancing::LoadBalancer', {
      Listeners: [{
        InstancePort: '8080',
        InstanceProtocol: 'http',
        LoadBalancerPort: '8080',
        Protocol: 'http',
      }],
    }));
  });

  test('add a health check', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VCP');

    // WHEN
    new LoadBalancer(stack, 'LB', {
      vpc,
      healthCheck: {
        interval: Duration.minutes(1),
        path: '/ping',
        protocol: LoadBalancingProtocol.HTTPS,
        port: 443,
      },
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancing::LoadBalancer', {
      HealthCheck: {
        HealthyThreshold: '2',
        Interval: '60',
        Target: 'HTTPS:443/ping',
        Timeout: '5',
        UnhealthyThreshold: '5',
      },
    }));
  });

  test('add a listener and load balancing target', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VCP');
    const elb = new LoadBalancer(stack, 'LB', {
      vpc,
      healthCheck: {
        interval: Duration.minutes(1),
        path: '/ping',
        protocol: LoadBalancingProtocol.HTTPS,
        port: 443,
      },
    });

    // WHEN
    elb.addListener({ externalPort: 80, internalPort: 8080 });
    elb.addTarget(new FakeTarget());

    // THEN: at the very least it added a security group rule for the backend
    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          Description: 'Port 8080 LB to fleet',
          CidrIp: '666.666.666.666/666',
          FromPort: 8080,
          IpProtocol: 'tcp',
          ToPort: 8080,
        },
      ],
    }));
  });

  test('enable cross zone load balancing', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VCP');

    // WHEN
    new LoadBalancer(stack, 'LB', {
      vpc,
      crossZone: true,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancing::LoadBalancer', {
      CrossZone: true,
    }));
  });

  test('disable cross zone load balancing', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VCP');

    // WHEN
    new LoadBalancer(stack, 'LB', {
      vpc,
      crossZone: false,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancing::LoadBalancer', {
      CrossZone: false,
    }));
  });

  test('cross zone load balancing enabled by default', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VCP');

    // WHEN
    new LoadBalancer(stack, 'LB', {
      vpc,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancing::LoadBalancer', {
      CrossZone: true,
    }));
  });

  test('use specified subnet', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VCP', {
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 21,
        },
        {
          name: 'private1',
          subnetType: SubnetType.PRIVATE,
          cidrMask: 21,
        },
        {
          name: 'private2',
          subnetType: SubnetType.PRIVATE,
          cidrMask: 21,
        },
      ],
    });

    // WHEN
    new LoadBalancer(stack, 'LB', {
      vpc,
      subnetSelection: {
        subnetGroupName: 'private1',
      },
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancing::LoadBalancer', {
      Subnets: vpc.selectSubnets({
        subnetGroupName: 'private1',
      }).subnetIds.map((subnetId: string) => stack.resolve(subnetId)),
    }));
  });
});

class FakeTarget implements ILoadBalancerTarget {
  public readonly connections = new Connections({
    peer: Peer.ipv4('666.666.666.666/666'),
  });

  public attachToClassicLB(_loadBalancer: LoadBalancer): void {
    // Nothing to do. Normally we set a property on ourselves so
    // our instances know to bind to the LB on startup.
  }
}
