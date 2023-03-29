import { Template } from '@aws-cdk/assertions';
import { App, Stack } from '@aws-cdk/core';
import * as ivs from '../lib';

const publicKey = `-----BEGIN PUBLIC KEY-----
MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEs6k8Xf6WyFq3yZXoup8G/gH6DntSATqD
Yfo83eX0GJCKxJ8fr09h9LP9HDGof8/bo66P+SGHeAARGF/O9WPAQVUgSlm/KMFX
EPtPtOm1s0GR9k1ydU5hkI++f9CoZ5lM
-----END PUBLIC KEY-----`;

let stack: Stack;

beforeEach( () => {
  const app = new App({
    context: {
      '@aws-cdk/core:newStyleStackSynthesis': false,
    },
  });
  stack = new Stack(app);
});

test('channel default properties', () => {
  new ivs.Channel(stack, 'Channel');

  Template.fromStack(stack).hasResource('AWS::IVS::Channel', {
    Properties: {
      Name: 'Channel',
    },
  });
});

test('channel name', () => {
  new ivs.Channel(stack, 'Channel', {
    channelName: 'CarrotsAreTasty',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IVS::Channel', {
    Name: 'CarrotsAreTasty',
  });
});

test('channel is authorized', () => {
  new ivs.Channel(stack, 'Channel', {
    authorized: true,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IVS::Channel', {
    Authorized: true,
  });
});

test('channel type', () => {
  new ivs.Channel(stack, 'Channel', {
    type: ivs.ChannelType.BASIC,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IVS::Channel', {
    Type: 'BASIC',
  });
});

test('channel latency mode', () => {
  new ivs.Channel(stack, 'Channel', {
    latencyMode: ivs.LatencyMode.NORMAL,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IVS::Channel', {
    LatencyMode: 'NORMAL',
  });
});

test('channel from arn', () => {
  const channel = ivs.Channel.fromChannelArn(stack, 'Channel', 'arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh');

  expect(stack.resolve(channel.channelArn)).toBe('arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh');
});

test('channel invalid name throws validation error', () => {
  expect(() => new ivs.Channel(stack, 'Channel', {
    channelName: 'Would you like a carrot?',
  })).toThrow('channelName must contain only numbers, letters, hyphens and underscores, got: \'Would you like a carrot?\'');
});

test('playback key pair mandatory properties', () => {
  new ivs.PlaybackKeyPair(stack, 'PlaybackKeyPair', {
    publicKeyMaterial: publicKey,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IVS::PlaybackKeyPair', {
    PublicKeyMaterial: publicKey,
  });
});

test('playback key pair name', () => {
  new ivs.PlaybackKeyPair(stack, 'PlaybackKeyPair', {
    publicKeyMaterial: publicKey,
    playbackKeyPairName: 'CarrotsAreNutritious',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IVS::PlaybackKeyPair', {
    PublicKeyMaterial: publicKey,
    Name: 'CarrotsAreNutritious',
  });
});

test('playback key pair invalid name throws validation error', () => {
  expect(() => new ivs.PlaybackKeyPair(stack, 'PlaybackKeyPair', {
    publicKeyMaterial: 'Carrots Are Orange',
    playbackKeyPairName: 'Would you like a carrot?',
  })).toThrow('playbackKeyPairName must contain only numbers, letters, hyphens and underscores, got: \'Would you like a carrot?\'');
});

test('stream key mandatory properties', () => {
  new ivs.StreamKey(stack, 'StreamKey', {
    channel: ivs.Channel.fromChannelArn(stack, 'ChannelRef', 'arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh'),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IVS::StreamKey', {
    ChannelArn: 'arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh',
  });
});

test('channel and stream key.. at the same time', () => {
  const channel = new ivs.Channel(stack, 'Channel');
  channel.addStreamKey('StreamKey');

  Template.fromStack(stack).templateMatches({
    Resources: {
      Channel4048F119: {
        Type: 'AWS::IVS::Channel',
      },
      ChannelStreamKey60BDC2BE: {
        Type: 'AWS::IVS::StreamKey',
        Properties: {
          ChannelArn: { 'Fn::GetAtt': ['Channel4048F119', 'Arn'] },
        },
      },
    },
  });
});

test('stream key from channel reference', () => {
  const channel = ivs.Channel.fromChannelArn(stack, 'Channel', 'arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh');
  channel.addStreamKey('StreamKey');

  Template.fromStack(stack).hasResourceProperties('AWS::IVS::StreamKey', {
    ChannelArn: 'arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh',
  });
});

test('channel from invalid channel arn throws error', () => {
  expect(() => ivs.Channel.fromChannelArn(stack, 'ChannelRef', 'this is an invalid arn, in fact, it is a carrot 🥕'))
    .toThrow('ARNs must start with \"arn:\" and have at least 6 components: this is an invalid arn, in fact, it is a carrot 🥕');
});

test('channel from invalid channel arn service throws error', () => {
  expect(
    () => ivs.Channel.fromChannelArn(stack, 'ChannelRef', 'arn:aws:ec2:us-west-2:123456789012:instance/abcdABCDefgh'))
    .toThrow('Invalid service, expected \'ivs\', got \'ec2\'');
});

test('channel from invalid channel arn resource throws error', () => {
  expect(
    () => ivs.Channel.fromChannelArn(stack, 'ChannelRef', 'arn:aws:ivs:us-west-2:123456789012:stream-key/abcdABCDefgh'))
    .toThrow('Invalid resource, expected \'channel\', got \'stream-key\'');
});
