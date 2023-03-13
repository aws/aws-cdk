import { Template } from '@aws-cdk/assertions';
import { AmazonLinuxGeneration, Connections, Instance, InstanceClass, InstanceSize, InstanceType, MachineImage, Peer, SubnetType, Vpc } from '@aws-cdk/aws-ec2';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Duration, Stack } from '@aws-cdk/core';
import { ILoadBalancerTarget, InstanceTarget, LoadBalancer, LoadBalancingProtocol } from '../lib';

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

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancing::LoadBalancer', {
      Listeners: [{
        InstancePort: '8080',
        InstanceProtocol: 'http',
        LoadBalancerPort: '8080',
        Protocol: 'http',
      }],
    });
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
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancing::LoadBalancer', {
      HealthCheck: {
        HealthyThreshold: '2',
        Interval: '60',
        Target: 'HTTPS:443/ping',
        Timeout: '5',
        UnhealthyThreshold: '5',
      },
    });
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
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          Description: 'Port 8080 LB to fleet',
          CidrIp: '666.666.666.666/666',
          FromPort: 8080,
          IpProtocol: 'tcp',
          ToPort: 8080,
        },
      ],
    });
  });

  test('add an Instance as a load balancing target', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VCP');
    const instance = new Instance(stack, 'targetInstance', {
      vpc: vpc,
      instanceType: InstanceType.of( // t2.micro has free tier usage in aws
        InstanceClass.T2,
        InstanceSize.MICRO,
      ),
      machineImage: MachineImage.latestAmazonLinux({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
    });
    const elb = new LoadBalancer(stack, 'LB', {
      vpc,
    });

    // WHEN
    elb.addListener({ externalPort: 80, internalPort: 8080 });
    elb.addTarget(new InstanceTarget(instance));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancing::LoadBalancer', {
      CrossZone: true,
      Instances: [
        {
          Ref: 'targetInstance603C5817',
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
      Description: 'Port 8080 LB to fleet',
      FromPort: 8080,
      IpProtocol: 'tcp',
      ToPort: 8080,
      GroupId: {
        'Fn::GetAtt': [
          'LBSecurityGroup8A41EA2B',
          'GroupId',
        ],
      },
      DestinationSecurityGroupId: {
        'Fn::GetAtt': [
          'targetInstanceInstanceSecurityGroupF268BD07',
          'GroupId',
        ],
      },
    });
  });

  test('order test for addTarget and addListener', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VCP');
    const instance = new Instance(stack, 'targetInstance', {
      vpc: vpc,
      instanceType: InstanceType.of( // t2.micro has free tier usage in aws
        InstanceClass.T2,
        InstanceSize.MICRO,
      ),
      machineImage: MachineImage.latestAmazonLinux({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
    });
    const elb = new LoadBalancer(stack, 'LB', {
      vpc,
    });

    // WHEN
    elb.addTarget(new InstanceTarget(instance));
    elb.addListener({ externalPort: 80, internalPort: 8080 });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancing::LoadBalancer', {
      CrossZone: true,
      Instances: [
        {
          Ref: 'targetInstance603C5817',
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
      Description: 'Port 8080 LB to fleet',
      FromPort: 8080,
      IpProtocol: 'tcp',
      ToPort: 8080,
      GroupId: {
        'Fn::GetAtt': [
          'LBSecurityGroup8A41EA2B',
          'GroupId',
        ],
      },
      DestinationSecurityGroupId: {
        'Fn::GetAtt': [
          'targetInstanceInstanceSecurityGroupF268BD07',
          'GroupId',
        ],
      },
    });
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
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancing::LoadBalancer', {
      CrossZone: true,
    });
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
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancing::LoadBalancer', {
      CrossZone: false,
    });
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
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancing::LoadBalancer', {
      CrossZone: true,
    });
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
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 21,
        },
        {
          name: 'private2',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
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
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancing::LoadBalancer', {
      Subnets: vpc.selectSubnets({
        subnetGroupName: 'private1',
      }).subnetIds.map((subnetId: string) => stack.resolve(subnetId)),
    });
  });

  testDeprecated('does not fail when deprecated property sslCertificateId is used', () => {
    // GIVEN
    const sslCertificateArn = 'arn:aws:acm:us-east-1:12345:test/12345';
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VCP');

    // WHEN
    const lb = new LoadBalancer(stack, 'LB', { vpc });

    lb.addListener({
      externalPort: 80,
      internalPort: 8080,
      sslCertificateId: sslCertificateArn,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancing::LoadBalancer', {
      Listeners: [{
        InstancePort: '8080',
        InstanceProtocol: 'http',
        LoadBalancerPort: '80',
        Protocol: 'http',
        SSLCertificateId: sslCertificateArn,
      }],
    });
  });

  test('does not fail when sslCertificateArn is used', () => {
    // GIVEN
    const sslCertificateArn = 'arn:aws:acm:us-east-1:12345:test/12345';
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VCP');

    // WHEN
    const lb = new LoadBalancer(stack, 'LB', { vpc });

    lb.addListener({
      externalPort: 80,
      internalPort: 8080,
      sslCertificateArn: sslCertificateArn,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancing::LoadBalancer', {
      Listeners: [{
        InstancePort: '8080',
        InstanceProtocol: 'http',
        LoadBalancerPort: '80',
        Protocol: 'http',
        SSLCertificateId: sslCertificateArn,
      }],
    });
  });

  testDeprecated('throws error when both sslCertificateId and sslCertificateArn are used', () => {
    // GIVEN
    const sslCertificateArn = 'arn:aws:acm:us-east-1:12345:test/12345';
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VCP');

    // WHEN
    const lb = new LoadBalancer(stack, 'LB', { vpc });

    // THEN
    expect(() =>
      lb.addListener({
        externalPort: 80,
        internalPort: 8080,
        sslCertificateArn: sslCertificateArn,
        sslCertificateId: sslCertificateArn,
      })).toThrow(/"sslCertificateId" is deprecated, please use "sslCertificateArn" only./);
  });

  test('enable load balancer access logs', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VCP');

    // WHEN
    new LoadBalancer(stack, 'LB', {
      vpc,
      accessLoggingPolicy: {
        enabled: true,
        s3BucketName: 'fakeBucket',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancing::LoadBalancer', {
      AccessLoggingPolicy: {
        Enabled: true,
        S3BucketName: 'fakeBucket',
      },
    });
  });

  test('disable load balancer access logs', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VCP');

    // WHEN
    new LoadBalancer(stack, 'LB', {
      vpc,
      accessLoggingPolicy: {
        enabled: false,
        s3BucketName: 'fakeBucket',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancing::LoadBalancer', {
      AccessLoggingPolicy: {
        Enabled: false,
        S3BucketName: 'fakeBucket',
      },
    });
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
