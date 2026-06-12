import { App, Bitrate, Duration, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

import { Flow } from '../lib/flow';
import { FlowOutput, OutputConfiguration } from '../lib/flow-output';
import { NetworkConfiguration, SourceConfiguration } from '../lib/flow-source-configuration';
import { EncryptionAlgorithm } from '../lib/shared';

let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, undefined, {
    env: { account: '123456789012', region: 'us-east-1' },
  });
});

test('MediaConnect flow with rtp-fec creation', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'my-flow',
      network: NetworkConfiguration.publicNetwork('10.1.0.0/16'),
      description: 'my test flow',
      maxBitrate: Bitrate.mbps(10),
      port: 2099,
    }),
  });

  new FlowOutput(stack, 'output', {
    flowOutputName: 'my-first-output',
    description: 'rtp-output',
    flow,
    outputConfig: OutputConfiguration.rtpFec({
      destination: '192.168.1.100',
      port: 5000,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowOutput', {
    Description: 'rtp-output',
    Destination: '192.168.1.100',
    FlowArn: { 'Fn::GetAtt': ['flowAF0E31A5', 'FlowArn'] },
    Name: 'my-first-output',
    Port: 5000,
    Protocol: 'rtp-fec',
  });
});

test('MediaConnect flow with ndi creation', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'my-flow',
      network: NetworkConfiguration.publicNetwork('10.1.0.0/16'),
      description: 'my test flow',
      maxBitrate: Bitrate.mbps(10),
      port: 2099,
    }),
  });

  new FlowOutput(stack, 'output', {
    flowOutputName: 'my-first-output',
    description: 'ndi-output',
    flow,
    outputConfig: OutputConfiguration.ndi({
      ndiProgramName: 'output',
      ndiSpeedHqQuality: 100,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowOutput', {
    Description: 'ndi-output',
    FlowArn: { 'Fn::GetAtt': ['flowAF0E31A5', 'FlowArn'] },
    Name: 'my-first-output',
    NdiProgramName: 'output',
    NdiSpeedHqQuality: 100,
    Protocol: 'ndi-speed-hq',
  });
});

test('Invalid encryption configuration for SRT Caller', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'my-flow',
      network: NetworkConfiguration.publicNetwork('10.1.0.0/16'),
      description: 'my test flow',
      maxBitrate: Bitrate.mbps(10),
      port: 2099,
    }),
  });

  new FlowOutput(stack, 'output', {
    flowOutputName: 'my-first-output',
    description: 'srt-output',
    flow,
    outputConfig: OutputConfiguration.srtCaller({
      destination: '10.10.10.10',
      port: 1111,
      encryption: ({
        role: Role.fromRoleName(stack, 'role', 'my-role'),
        secret: Secret.fromSecretNameV2(stack, 'secret', 'my-secret'),
      }),
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowOutput', {
    Description: 'srt-output',
    Destination: '10.10.10.10',
    Encryption: {
      KeyType: 'srt-password',
      RoleArn: {
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':iam::123456789012:role/my-role',
        ]],
      },
      SecretArn: {
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':secretsmanager:us-east-1:123456789012:secret:my-secret',
        ]],
      },
    },
    FlowArn: { 'Fn::GetAtt': ['flowAF0E31A5', 'FlowArn'] },
    Name: 'my-first-output',
    Port: 1111,
    Protocol: 'srt-caller',
  });
});

test('Flow output with router integration', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'source',
      network: NetworkConfiguration.publicNetwork('10.0.0.0/16'),
      maxBitrate: Bitrate.mbps(10),
      port: 2099,
    }),
  });

  new FlowOutput(stack, 'output', {
    flow,
    outputConfig: OutputConfiguration.router(),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowOutput', {
    FlowArn: { 'Fn::GetAtt': ['flowAF0E31A5', 'FlowArn'] },
  });
});

test('Flow output with RTP', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'source',
      network: NetworkConfiguration.publicNetwork('10.0.0.0/16'),
      maxBitrate: Bitrate.mbps(10),
      port: 2099,
    }),
  });

  new FlowOutput(stack, 'output', {
    flow,
    outputConfig: OutputConfiguration.rtp({
      destination: '192.168.1.1',
      port: 5000,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowOutput', {
    Destination: '192.168.1.1',
    Port: 5000,
    Protocol: 'rtp',
  });
});

test('Flow output with RIST', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'source',
      network: NetworkConfiguration.publicNetwork('10.0.0.0/16'),
      maxBitrate: Bitrate.mbps(10),
      port: 2099,
    }),
  });

  new FlowOutput(stack, 'output', {
    flow,
    outputConfig: OutputConfiguration.rist({
      destination: '192.168.1.1',
      port: 6000,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowOutput', {
    Destination: '192.168.1.1',
    Port: 6000,
    Protocol: 'rist',
  });
});

test('Flow output with SRT Listener', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'source',
      network: NetworkConfiguration.publicNetwork('10.0.0.0/16'),
      maxBitrate: Bitrate.mbps(10),
      port: 2099,
    }),
  });

  new FlowOutput(stack, 'output', {
    flow,
    outputConfig: OutputConfiguration.srtListener({
      port: 7000,
      cidrAllowList: ['10.0.0.0/8'],
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowOutput', {
    Port: 7000,
    Protocol: 'srt-listener',
    CidrAllowList: ['10.0.0.0/8'],
  });
});

test('Flow output with Zixi Pull', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'source',
      network: NetworkConfiguration.publicNetwork('10.0.0.0/16'),
      maxBitrate: Bitrate.mbps(10),
      port: 2099,
    }),
  });

  new FlowOutput(stack, 'output', {
    flow,
    outputConfig: OutputConfiguration.zixiPull({
      streamId: 'test-stream',
      remoteId: 'remote-1',
      maxLatency: Duration.millis(1000),
      cidrAllowList: ['10.0.0.0/16'],
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowOutput', {
    Protocol: 'zixi-pull',
    StreamId: 'test-stream',
    RemoteId: 'remote-1',
    MaxLatency: 1000,
    CidrAllowList: ['10.0.0.0/16'],
  });
});

test('Flow output with Zixi Push', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'source',
      network: NetworkConfiguration.publicNetwork('10.0.0.0/16'),
      maxBitrate: Bitrate.mbps(10),
      port: 2099,
    }),
  });

  new FlowOutput(stack, 'output', {
    flow,
    outputConfig: OutputConfiguration.zixiPush({
      streamId: 'test-stream',
      destination: '10.0.0.1',
      port: 2088,
      maxLatency: Duration.millis(500),
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowOutput', {
    Protocol: 'zixi-push',
    Destination: '10.0.0.1',
    Port: 2088,
    StreamId: 'test-stream',
    MaxLatency: 500,
  });
});

test('Flow output with router integration and transit encryption', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'source',
      network: NetworkConfiguration.publicNetwork('10.0.0.0/16'),
      maxBitrate: Bitrate.mbps(10),
      port: 2099,
    }),
  });

  const role = Role.fromRoleName(stack, 'role', 'my-role');
  const secret = Secret.fromSecretNameV2(stack, 'secret2', 'my-secret');

  new FlowOutput(stack, 'output', {
    flow,
    outputConfig: OutputConfiguration.router({
      encryption: ({
        role,
        secret,
      }),
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowOutput', {
    FlowArn: { 'Fn::GetAtt': ['flowAF0E31A5', 'FlowArn'] },
  });
});

test('Flow output name validation', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'source',
      network: NetworkConfiguration.publicNetwork('10.0.0.0/16'),
      maxBitrate: Bitrate.mbps(10),
      port: 2099,
    }),
  });

  expect(() => {
    new FlowOutput(stack, 'output', {
      flowOutputName: 'invalid@name!',
      flow,
      outputConfig: OutputConfiguration.rtp({
        destination: '192.168.1.100',
        port: 5000,
      }),
    });
  }).toThrow(/Flow output name must contain only alphanumeric characters/);
});

test('Flow output name validation - too long', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'source',
      network: NetworkConfiguration.publicNetwork('10.0.0.0/16'),
      maxBitrate: Bitrate.mbps(10),
      port: 2099,
    }),
  });

  expect(() => {
    new FlowOutput(stack, 'output', {
      flowOutputName: 'a'.repeat(129),
      flow,
      outputConfig: OutputConfiguration.rtp({
        destination: '192.168.1.100',
        port: 5000,
      }),
    });
  }).toThrow(/Flow output name must be between 1 and 128 characters/);
});

test('Zixi Pull output with static-key encryption', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'my-flow',
      network: NetworkConfiguration.publicNetwork('10.1.0.0/16'),
      port: 2099,
    }),
  });
  const role = new Role(stack, 'EncRole', { assumedBy: new ServicePrincipal('mediaconnect.amazonaws.com') });
  const secret = new Secret(stack, 'EncSecret');

  new FlowOutput(stack, 'zixiPull', {
    flow,
    outputConfig: OutputConfiguration.zixiPull({
      streamId: 'live',
      remoteId: 'remote-1',
      maxLatency: Duration.millis(1000),
      cidrAllowList: ['198.51.100.0/24'],
      encryption: ({
        role,
        secret,
        algorithm: EncryptionAlgorithm.AES256,
      }),
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::FlowOutput', {
    Protocol: 'zixi-pull',
    Encryption: {
      Algorithm: 'aes256',
      KeyType: 'static-key',
      RoleArn: Match.anyValue(),
      SecretArn: Match.anyValue(),
    },
  });
});

test('Zixi Push output with static-key encryption auto-creates a role when none is provided', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'my-flow',
      network: NetworkConfiguration.publicNetwork('10.1.0.0/16'),
      port: 2099,
    }),
  });
  const secret = new Secret(stack, 'EncSecret');

  new FlowOutput(stack, 'zixiPush', {
    flow,
    outputConfig: OutputConfiguration.zixiPush({
      destination: '198.51.100.10',
      port: 2088,
      streamId: 'live',
      maxLatency: Duration.millis(1000),
      encryption: ({
        secret,
        algorithm: EncryptionAlgorithm.AES128,
      }),
    }),
  });

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
          ArnLike: { 'aws:SourceArn': Match.anyValue() },
        },
      }],
      Version: '2012-10-17',
    },
  });
  // Output references the auto-role ARN
  template.hasResourceProperties('AWS::MediaConnect::FlowOutput', {
    Protocol: 'zixi-push',
    Encryption: {
      Algorithm: 'aes128',
      KeyType: 'static-key',
    },
  });
});

test('SRT Caller output with SRT password encryption auto-creates a role when none is provided', () => {
  const flow = new Flow(stack, 'flow', {
    source: SourceConfiguration.rtpFec({
      flowSourceName: 'my-flow',
      network: NetworkConfiguration.publicNetwork('10.1.0.0/16'),
      port: 2099,
    }),
  });
  const secret = new Secret(stack, 'EncSecret');

  new FlowOutput(stack, 'srtCaller', {
    flow,
    outputConfig: OutputConfiguration.srtCaller({
      destination: '198.51.100.10',
      port: 9100,
      minLatency: Duration.millis(120),
      encryption: ({ secret }),
    }),
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [{
        Effect: 'Allow',
        Principal: { Service: 'mediaconnect.amazonaws.com' },
        Action: 'sts:AssumeRole',
        Condition: {
          StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' } },
          ArnLike: { 'aws:SourceArn': Match.anyValue() },
        },
      }],
      Version: '2012-10-17',
    },
  });
  template.hasResourceProperties('AWS::MediaConnect::FlowOutput', {
    Protocol: 'srt-caller',
    Encryption: {
      KeyType: 'srt-password',
    },
  });
});
