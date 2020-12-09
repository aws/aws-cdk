import '@aws-cdk/assert/jest';
import { expect as expectStack } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import * as ivs from '../lib';

const publicKey = `-----BEGIN PUBLIC KEY-----
MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEs6k8Xf6WyFq3yZXoup8G/gH6DntSATqD
Yfo83eX0GJCKxJ8fr09h9LP9HDGof8/bo66P+SGHeAARGF/O9WPAQVUgSlm/KMFX
EPtPtOm1s0GR9k1ydU5hkI++f9CoZ5lM
-----END PUBLIC KEY-----`;

test('channel default properties', () => {
  const stack = new Stack();
  new ivs.Channel(stack, 'Channel');

  expectStack(stack).toMatch({
    Resources: {
      Channel4048F119: {
        Type: 'AWS::IVS::Channel',
      },
    },
  });
});

test('channel name', () => {
  const stack = new Stack();
  new ivs.Channel(stack, 'Channel', {
    name: 'CarrotsAreTasty',
  });

  expectStack(stack).toMatch({
    Resources: {
      Channel4048F119: {
        Type: 'AWS::IVS::Channel',
        Properties: {
          Name: 'CarrotsAreTasty',
        },
      },
    },
  });
});

test('channel is authorized', () => {
  const stack = new Stack();
  new ivs.Channel(stack, 'Channel', {
    authorized: true,
  });

  expectStack(stack).toMatch({
    Resources: {
      Channel4048F119: {
        Type: 'AWS::IVS::Channel',
        Properties: {
          Authorized: 'true',
        },
      },
    },
  });
});

test('channel type', () => {
  const stack = new Stack();
  new ivs.Channel(stack, 'Channel', {
    type: ivs.ChannelType.BASIC,
  });

  expectStack(stack).toMatch({
    Resources: {
      Channel4048F119: {
        Type: 'AWS::IVS::Channel',
        Properties: {
          Type: 'BASIC',
        },
      },
    },
  });
});

test('channel latency mode', () => {
  const stack = new Stack();
  new ivs.Channel(stack, 'Channel', {
    latencyMode: ivs.LatencyMode.NORMAL,
  });

  expectStack(stack).toMatch({
    Resources: {
      Channel4048F119: {
        Type: 'AWS::IVS::Channel',
        Properties: {
          LatencyMode: 'NORMAL',
        },
      },
    },
  });
});

test('channel from arn', () => {
  const stack = new Stack();
  const channel = ivs.Channel.fromChannelArn(stack, 'Channel', 'arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh');

  expect(stack.resolve(channel.channelArn)).toBe('arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh');
});

test('channel invalid name throws validation error', () => {
  const stack = new Stack();

  expect(() => new ivs.Channel(stack, 'Channel', {
    name: 'Would you like a carrot?',
  })).toThrow('name must contain only numbers, letters, hyphens and underscores, got: \'Would you like a carrot?\'');
});

test('playback key pair mandatory properties', () => {
  const stack = new Stack();
  new ivs.PlaybackKeyPair(stack, 'PlaybackKeyPair', {
    publicKeyMaterial: publicKey,
  });

  expectStack(stack).toMatch({
    Resources: {
      PlaybackKeyPairBE17315B: {
        Type: 'AWS::IVS::PlaybackKeyPair',
        Properties: {
          PublicKeyMaterial: publicKey,
        },
      },
    },
  });
});

test('playback key pair name', () => {
  const stack = new Stack();
  new ivs.PlaybackKeyPair(stack, 'PlaybackKeyPair', {
    publicKeyMaterial: publicKey,
    name: 'CarrotsAreNutritious',
  });

  expectStack(stack).toMatch({
    Resources: {
      PlaybackKeyPairBE17315B: {
        Type: 'AWS::IVS::PlaybackKeyPair',
        Properties: {
          PublicKeyMaterial: publicKey,
          Name: 'CarrotsAreNutritious',
        },
      },
    },
  });
});

test('playback key pair invalid name throws validation error', () => {
  const stack = new Stack();

  expect(() => new ivs.PlaybackKeyPair(stack, 'PlaybackKeyPair', {
    publicKeyMaterial: 'Carrots Are Orange',
    name: 'Would you like a carrot?',
  })).toThrow('name must contain only numbers, letters, hyphens and underscores, got: \'Would you like a carrot?\'');
});

test('stream key mandatory properties', () => {
  const stack = new Stack();
  new ivs.StreamKey(stack, 'StreamKey', {
    channel: ivs.Channel.fromChannelArn(stack, 'ChannelRef', 'arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh'),
  });

  expectStack(stack).toMatch({
    Resources: {
      StreamKey9F296F4F: {
        Type: 'AWS::IVS::StreamKey',
        Properties: {
          ChannelArn: 'arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh',
        },
      },
    },
  });
});

test('channel and stream key.. at the same time', () => {
  const stack = new Stack();
  const channel = new ivs.Channel(stack, 'Channel');
  channel.addStreamKey('StreamKey');

  expectStack(stack).toMatch({
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
  const stack = new Stack();
  const channel = ivs.Channel.fromChannelArn(stack, 'Channel', 'arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh');
  channel.addStreamKey('StreamKey');

  expectStack(stack).toMatch({
    Resources: {
      ChannelStreamKey60BDC2BE: {
        Type: 'AWS::IVS::StreamKey',
        Properties: {
          ChannelArn: 'arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh',
        },
      },
    },
  });
});

test('channel from invalid channel arn throws error', () => {
  const stack = new Stack();
  expect(() => ivs.Channel.fromChannelArn(stack, 'ChannelRef', 'this is an invalid arn, in fact, it is a carrot 🥕'))
    .toThrow('ARNs must start with \"arn:\" and have at least 6 components: this is an invalid arn, in fact, it is a carrot 🥕');
});

test('channel from invalid channel arn service throws error', () => {
  const stack = new Stack();
  expect(
    () => ivs.Channel.fromChannelArn(stack, 'ChannelRef', 'arn:aws:ec2:us-west-2:123456789012:instance/abcdABCDefgh'))
    .toThrow('Invalid service, expected \'ivs\', got \'ec2\'');
});

test('channel from invalid channel arn resource throws error', () => {
  const stack = new Stack();
  expect(
    () => ivs.Channel.fromChannelArn(stack, 'ChannelRef', 'arn:aws:ivs:us-west-2:123456789012:stream-key/abcdABCDefgh'))
    .toThrow('Invalid resource, expected \'channel\', got \'stream-key\'');
});
