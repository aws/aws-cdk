import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import { App, Stack } from '../../core';
import { OriginProtocolPolicy, OriginSslPolicy, VpcOrigin, VpcOriginEndpoint } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('VPC origin from an EC2 instance', () => {
  // GIVEN
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const instance = new ec2.Instance(stack, 'Instance', {
    vpc,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MICRO),
    machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  });

  // WHEN
  const vpcOrigin = new VpcOrigin(stack, 'VpcOrigin', {
    endpoint: VpcOriginEndpoint.fromEc2Instance(instance),
  });

  // THEN
  expect(stack.resolve(vpcOrigin.domainName)).toEqual({ 'Fn::GetAtt': ['InstanceC1063A87', 'PrivateDnsName'] });
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
    VpcOriginEndpointConfig: {
      Arn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':ec2:testregion:1234:instance/',
            { Ref: 'InstanceC1063A87' },
          ],
        ],
      },
      Name: 'StackVpcOrigin17D434EE',
      OriginSSLProtocols: ['TLSv1.2'],
    },
  });
});

test('VPC origin from an Application Load Balancer', () => {
  // GIVEN
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });

  // WHEN
  const vpcOrigin = new VpcOrigin(stack, 'VpcOrigin', {
    endpoint: VpcOriginEndpoint.fromApplicationLoadBalancer(loadBalancer),
  });

  // THEN
  expect(stack.resolve(vpcOrigin.domainName)).toEqual({ 'Fn::GetAtt': ['ALBAEE750D2', 'DNSName'] });
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
    VpcOriginEndpointConfig: {
      Arn: { Ref: 'ALBAEE750D2' },
      Name: 'StackVpcOrigin17D434EE',
      OriginSSLProtocols: ['TLSv1.2'],
    },
  });
});

test('VPC origin from a Network Load Balancer', () => {
  // GIVEN
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const loadBalancer = new elbv2.NetworkLoadBalancer(stack, 'NLB', { vpc });

  // WHEN
  const vpcOrigin = new VpcOrigin(stack, 'VpcOrigin', {
    endpoint: VpcOriginEndpoint.fromNetworkLoadBalancer(loadBalancer),
  });

  // THEN
  expect(stack.resolve(vpcOrigin.domainName)).toEqual({ 'Fn::GetAtt': ['NLB55158F82', 'DNSName'] });
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
    VpcOriginEndpointConfig: {
      Arn: { Ref: 'NLB55158F82' },
      Name: 'StackVpcOrigin17D434EE',
      OriginSSLProtocols: ['TLSv1.2'],
    },
  });
});

test('VPC origin from an opaque endpoint ARN', () => {
  // WHEN
  const vpcOrigin = new VpcOrigin(stack, 'VpcOrigin', {
    endpoint: new VpcOriginEndpoint({ endpointArn: 'arn:opaque' }),
  });

  // THEN
  expect(stack.resolve(vpcOrigin.domainName)).toBeUndefined();
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
    VpcOriginEndpointConfig: {
      Arn: 'arn:opaque',
      Name: 'StackVpcOrigin17D434EE',
      OriginSSLProtocols: ['TLSv1.2'],
    },
  });
});

test('VPC origin with options configureed', () => {
  // WHEN
  const vpcOrigin = new VpcOrigin(stack, 'VpcOrigin', {
    endpoint: new VpcOriginEndpoint({ endpointArn: 'arn:opaque' }),
    vpcOriginName: 'VpcOriginName',
    httpPort: 8080,
    httpsPort: 8443,
    protocolPolicy: OriginProtocolPolicy.MATCH_VIEWER,
    originSslProtocols: [OriginSslPolicy.TLS_V1_1, OriginSslPolicy.TLS_V1_2],
  });

  // THEN
  expect(stack.resolve(vpcOrigin.domainName)).toBeUndefined();
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::VpcOrigin', {
    VpcOriginEndpointConfig: {
      Name: 'VpcOriginName',
      HTTPPort: 8080,
      HTTPSPort: 8443,
      OriginProtocolPolicy: 'match-viewer',
      OriginSSLProtocols: ['TLSv1.1', 'TLSv1.2'],
    },
  });
});

test('VPC origin imports from vpcOriginId', () => {
  // WHEN
  const vpcOrigin = VpcOrigin.fromVpcOriginId(stack, 'VpcOrigin', 'vpc-origin-id');

  // THEN
  expect(vpcOrigin.vpcOriginId).toEqual('vpc-origin-id');
  expect(stack.resolve(vpcOrigin.vpcOriginArn)).toEqual({
    'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':cloudfront::1234:vpcorigin/vpc-origin-id']],
  });
  expect(vpcOrigin.domainName).toBeUndefined();
});

test.each([88, 444, 65536])('VPC origins throws when httpPort is %s', (port) => {
  expect(() => {
    new VpcOrigin(stack, 'VpcOrigin', {
      endpoint: new VpcOriginEndpoint({ endpointArn: 'arn:opaque' }),
      httpPort: port,
    });
  }).toThrow(`'httpPort' must be 80, 443, or a value between 1024 and 65535, got ${port}`);
});

test.each([88, 444, 65536])('VPC origins throws when httpsPort is %s', (port) => {
  expect(() => {
    new VpcOrigin(stack, 'VpcOrigin', {
      endpoint: new VpcOriginEndpoint({ endpointArn: 'arn:opaque' }),
      httpsPort: port,
    });
  }).toThrow(`'httpsPort' must be 80, 443, or a value between 1024 and 65535, got ${port}`);
});
