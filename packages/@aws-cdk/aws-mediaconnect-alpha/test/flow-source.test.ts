import { App, Bitrate, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Vpc, IpAddresses, SubnetType, PrivateSubnet, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { Role, ServicePrincipal, PolicyDocument, PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

import { FailoverConfig, Flow } from '../lib/flow';
import { FlowSource } from '../lib/flow-source';
import { NetworkConfiguration, SourceConfiguration } from '../lib/flow-source-configuration';
import { EncryptionAlgorithm, VpcInterface } from '../lib/shared';

let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, undefined, {
    env: { account: '123456789012', region: 'us-east-1' },
  });
});

test('MediaConnect source with failover enabled', () => {
  const vpc = new Vpc(stack, 'testvpc', {
    ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
    subnetConfiguration: [{
      name: 'subnet1',
      subnetType: SubnetType.PRIVATE_ISOLATED,
      cidrMask: 24,
    }],
  });
  const subnet = new PrivateSubnet(stack, 'mysubnet', {
    availabilityZone: `${stack.region}a`,
    cidrBlock: '10.0.172.0/24',
    vpcId: vpc.vpcId,
  });
  const role = new Role(stack, 'my-role', {
    assumedBy: new ServicePrincipal('mediaconnect.amazonaws.com'),
    inlinePolicies: {
      default: new PolicyDocument({
        statements: [
          new PolicyStatement({
            actions: ['ec2:CreateNetworkInterface', 'ec2:CreateNetworkInterfacePermission', 'ec2:DeleteNetworkInterface', 'ec2:DescribeSubnets'],
            resources: ['*'],
            effect: Effect.ALLOW,
          }),
        ],
      }),
    },
  });
  const vpcInterface = VpcInterface.define({
    vpcInterfaceName: 'test',
    role,
    securityGroups: [new SecurityGroup(stack, 'sg', {
      vpc,
    })],
    subnet,
  });

  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'my-flow',
      network: NetworkConfiguration.vpc(vpcInterface),
      description: 'my test flow',
      maxBitrate: Bitrate.mbps(10),
      port: 2099,
    }),
    sourceFailoverConfig: FailoverConfig.failover(),
  });

  new FlowSource(stack, 'output', {
    flowSourceName: 'mysource',
    flow,
    source: SourceConfiguration.rtp({
      port: 1234,
      flowSourceName: 'mysource',
      description: 'mysource',
      network: NetworkConfiguration.vpc(vpcInterface),
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowSource', {
    Description: 'mysource',
    FlowArn: { 'Fn::GetAtt': ['flowAF0E31A5', 'FlowArn'] },
    IngestPort: 1234,
    Name: 'mysource',
    Protocol: 'rtp',
    VpcInterfaceName: 'test',
  });
});

test('fails - adding flow source when failover is disabled', () => {
  expect(() => {
    const vpc = new Vpc(stack, 'testvpc', {
      ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
      subnetConfiguration: [{
        name: 'subnet1',
        subnetType: SubnetType.PRIVATE_ISOLATED,
        cidrMask: 24,
      }],
    });
    const subnet = new PrivateSubnet(stack, 'mysubnet', {
      availabilityZone: `${stack.region}a`,
      cidrBlock: '10.0.172.0/24',
      vpcId: vpc.vpcId,
    });
    const role = new Role(stack, 'my-role', {
      assumedBy: new ServicePrincipal('mediaconnect.amazonaws.com'),
      inlinePolicies: {
        default: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['ec2:CreateNetworkInterface', 'ec2:CreateNetworkInterfacePermission', 'ec2:DeleteNetworkInterface', 'ec2:DescribeSubnets'],
              resources: ['*'],
              effect: Effect.ALLOW,
            }),
          ],
        }),
      },
    });
    const vpcInterface = VpcInterface.define({
      vpcInterfaceName: 'test',
      role,
      securityGroups: [new SecurityGroup(stack, 'sg', {
        vpc,
      })],
      subnet,
    });
    const flow = new Flow(stack, 'flow', {
      source: SourceConfiguration.rtpFec({
        flowSourceName: 'my-flow',
        network: NetworkConfiguration.vpc(vpcInterface),
        description: 'my test flow',
        maxBitrate: Bitrate.mbps(10),
        port: 2099,
      }),
      sourceFailoverConfig: undefined,
    });

    new FlowSource(stack, 'output', {
      flow,
      source: SourceConfiguration.rtp({
        port: 1234,
        flowSourceName: 'mysource',
        network: NetworkConfiguration.vpc(vpcInterface),
      }),
    });
  }).toThrow(/Failover configuration needs to be configured and enabled to add an additional Flow source/);
});

test('fails - flow source name too long', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtp({
      flowSourceName: 'main',
      port: 5000,
      network: NetworkConfiguration.publicNetwork('10.0.0.0/8'),
    }),
    sourceFailoverConfig: FailoverConfig.failover(),
  });

  expect(() => {
    new FlowSource(stack, 'src', {
      flowSourceName: 'a'.repeat(65),
      flow,
      source: SourceConfiguration.rtp({
        port: 5001,
        flowSourceName: 'ignored',
        network: NetworkConfiguration.publicNetwork('10.0.0.0/8'),
      }),
    });
  }).toThrow(/Flow source name must be between 1 and 64/);
});

test('fails - flow source name with invalid characters', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtp({
      flowSourceName: 'main',
      port: 5000,
      network: NetworkConfiguration.publicNetwork('10.0.0.0/8'),
    }),
    sourceFailoverConfig: FailoverConfig.failover(),
  });

  expect(() => {
    new FlowSource(stack, 'src', {
      flowSourceName: 'invalid@name',
      flow,
      source: SourceConfiguration.rtp({
        port: 5001,
        flowSourceName: 'ignored',
        network: NetworkConfiguration.publicNetwork('10.0.0.0/8'),
      }),
    });
  }).toThrow(/Flow source name must contain only alphanumeric characters/);
});

test('FlowSource.fromFlowSourceArn imports without ingest details', () => {
  const imported = FlowSource.fromFlowSourceArn(stack, 'imported',
    'arn:aws:mediaconnect:us-east-1:123456789012:source:1-abc:my-source');
  expect(imported.flowSourceArn).toBe('arn:aws:mediaconnect:us-east-1:123456789012:source:1-abc:my-source');
  expect(() => imported.ingestIp).toThrow(/'ingestIp' is not available on imported FlowSource/);
  expect(() => imported.sourceIngestPort).toThrow(/'sourceIngestPort' is not available on imported FlowSource/);
});

test('FlowSource.fromFlowSourceAttributes returns provided ingest details', () => {
  const imported = FlowSource.fromFlowSourceAttributes(stack, 'imported', {
    flowSourceArn: 'arn:aws:mediaconnect:us-east-1:123456789012:source:1-abc:s',
    ingestIp: '203.0.113.10',
    sourceIngestPort: '5000',
  });
  expect(imported.ingestIp).toBe('203.0.113.10');
  expect(imported.sourceIngestPort).toBe('5000');
});

test('Zixi Push source with static-key decryption auto-creates a role when none is provided', () => {
  const secret = new Secret(stack, 'DecSecret');

  const flow = new Flow(stack, 'flow', {
    flowName: 'my-flow',
    sourceFailoverConfig: FailoverConfig.failover(),
    source: SourceConfiguration.zixiPush({
      flowSourceName: 'zixi-src',
      maxLatency: Duration.millis(2000),
      network: NetworkConfiguration.publicNetwork('198.51.100.0/24'),
      decryption: ({
        secret,
        algorithm: EncryptionAlgorithm.AES256,
      }),
    }),
  });

  // silence unused-variable lint
  expect(flow).toBeDefined();

  const template = Template.fromStack(stack);
  // Auto-role with confused-deputy guard scoped to the flow
  template.hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [{
        Effect: 'Allow',
        Principal: { Service: 'mediaconnect.amazonaws.com' },
        Action: 'sts:AssumeRole',
        Condition: {
          StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' } },
          ArnLike: {
            'aws:SourceArn': {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':mediaconnect:us-east-1:123456789012:flow:*:my-flow',
              ]],
            },
          },
        },
      }],
      Version: '2012-10-17',
    },
  });
  template.hasResourceProperties('AWS::MediaConnect::Flow', {
    Source: {
      Protocol: 'zixi-push',
      Decryption: {
        Algorithm: 'aes256',
        KeyType: 'static-key',
      },
    },
  });
});
