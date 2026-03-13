import { Duration, Stack } from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import {
  Channel,
  ChannelGroup,
  CmafEncryption,
  CmafEncryptionMethod,
  TsEncryption,
  TsEncryptionMethod,
  TsDrmSystem,
  CmafDrmSystem,
  Manifest,
  OriginEndpoint,
  Segment,
  StartTag,
  InputConfiguration,
} from '../lib';

describe('StartTag Validation', () => {
  let stack: Stack;
  let group: ChannelGroup;
  let channel: Channel;

  beforeEach(() => {
    stack = new Stack();
    group = new ChannelGroup(stack, 'Group');
    channel = new Channel(stack, 'Channel', {
      channelGroup: group,
      input: InputConfiguration.cmaf(),
    });
  });

  test('validates positive timeOffset within bounds', () => {
    // With default 60s manifest and 6s segments, max positive offset is 42s
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf(),
        manifests: [
          Manifest.hls({
            manifestName: 'index',
            startTag: StartTag.of(41),
          }),
        ],
      });
    }).not.toThrow();
  });

  test('throws error when positive timeOffset is too large', () => {
    // With default 60s manifest and 6s segments, max positive offset is 42s
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf(),
        manifests: [
          Manifest.hls({
            manifestName: 'index',
            startTag: StartTag.of(50),
          }),
        ],
      });
    }).toThrow(/StartTag timeOffset.*must be less than manifest duration/);
  });

  test('validates negative timeOffset within bounds', () => {
    // With default 60s manifest and 6s segments, valid range is -18.01 to -59.99
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf(),
        manifests: [
          Manifest.hls({
            manifestName: 'index',
            startTag: StartTag.of(-30),
          }),
        ],
      });
    }).not.toThrow();
  });

  test('throws error when negative timeOffset is too close to live edge', () => {
    // With 6s segments, minimum is -18.01s
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf(),
        manifests: [
          Manifest.hls({
            manifestName: 'index',
            startTag: StartTag.of(-10),
          }),
        ],
      });
    }).toThrow(/absolute value must be greater than 3 times segment duration/);
  });

  test('throws error when negative timeOffset exceeds manifest duration', () => {
    // With 60s manifest, cannot exceed -60s
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf(),
        manifests: [
          Manifest.hls({
            manifestName: 'index',
            startTag: StartTag.of(-70),
          }),
        ],
      });
    }).toThrow(/absolute value must be less than manifest duration/);
  });

  test('validates with custom manifest window', () => {
    // With 120s manifest and 6s segments, max positive offset is 102s
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf(),
        manifests: [
          Manifest.hls({
            manifestName: 'index',
            manifestWindow: Duration.seconds(120),
            startTag: StartTag.of(100),
          }),
        ],
      });
    }).not.toThrow();
  });

  test('validates with custom segment duration', () => {
    // With 60s manifest and 10s segments, max positive offset is 30s
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf({
          duration: Duration.seconds(10),
        }),
        manifests: [
          Manifest.hls({
            manifestName: 'index',
            startTag: StartTag.of(29),
          }),
        ],
      });
    }).not.toThrow();
  });

  test('validates LL-HLS startTag', () => {
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf(),
        manifests: [
          Manifest.lowLatencyHLS({
            manifestName: 'index',
            startTag: StartTag.withPrecise(-30),
          }),
        ],
      });
    }).not.toThrow();
  });
});

describe('Encryption Validation', () => {
  let stack: Stack;
  let group: ChannelGroup;
  let channel: Channel;
  let role: Role;

  beforeEach(() => {
    stack = new Stack();
    group = new ChannelGroup(stack, 'Group');
    channel = new Channel(stack, 'Channel', {
      channelGroup: group,
      input: InputConfiguration.cmaf(),
    });
    role = new Role(stack, 'Role', {
      assumedBy: new ServicePrincipal('mediapackagev2.amazonaws.com'),
    });
  });

  test('validates CMAF CENC with correct DRM systems', () => {
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf({
          encryption: CmafEncryption.speke({
            method: CmafEncryptionMethod.CENC,
            drmSystems: [CmafDrmSystem.WIDEVINE],
            resourceId: 'test',
            role: role,
            url: 'https://example.com/speke',
          }),
        }),
        manifests: [Manifest.hls({ manifestName: 'index' })],
      });
    }).not.toThrow();
  });

  test('validates CMAF CBCS with correct DRM systems', () => {
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf({
          encryption: CmafEncryption.speke({
            method: CmafEncryptionMethod.CBCS,
            drmSystems: [CmafDrmSystem.FAIRPLAY],
            resourceId: 'test',
            role: role,
            url: 'https://example.com/speke',
          }),
        }),
        manifests: [Manifest.hls({ manifestName: 'index' })],
      });
    }).not.toThrow();
  });

  test('validates TS AES_128 encryption', () => {
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.ts({
          encryption: TsEncryption.speke({
            method: TsEncryptionMethod.AES_128,
            drmSystems: [TsDrmSystem.CLEAR_KEY_AES_128],
            resourceId: 'test',
            role: role,
            url: 'https://example.com/speke',
          }),
        }),
        manifests: [Manifest.hls({ manifestName: 'index' })],
      });
    }).not.toThrow();
  });

  test('throws error for invalid constant initialization vector length', () => {
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf({
          encryption: CmafEncryption.speke({
            method: CmafEncryptionMethod.CBCS,
            drmSystems: [CmafDrmSystem.FAIRPLAY],
            resourceId: 'test',
            role: role,
            url: 'https://example.com/speke',
            constantInitializationVector: 'tooshort',
          }),
        }),
        manifests: [Manifest.hls({ manifestName: 'index' })],
      });
    }).toThrow(/Constant Initialization Vector needs to be 32 characters in length/);
  });

  test('throws error for CENC with FairPlay DRM', () => {
    expect(() => {
      CmafEncryption.speke({
        method: CmafEncryptionMethod.CENC,
        drmSystems: [CmafDrmSystem.FAIRPLAY],
        resourceId: 'test',
        role: role,
        url: 'https://example.com/speke',
      });
    }).toThrow(/CENC encryption method does not support FairPlay/);
  });

  test('throws error for CBCS with Irdeto DRM', () => {
    expect(() => {
      CmafEncryption.speke({
        method: CmafEncryptionMethod.CBCS,
        drmSystems: [CmafDrmSystem.IRDETO],
        resourceId: 'test',
        role: role,
        url: 'https://example.com/speke',
      });
    }).toThrow(/CBCS encryption method does not support Irdeto/);
  });
});

describe('Segment Validation', () => {
  let stack: Stack;
  let group: ChannelGroup;
  let channel: Channel;

  beforeEach(() => {
    stack = new Stack();
    group = new ChannelGroup(stack, 'Group');
    channel = new Channel(stack, 'Channel', {
      channelGroup: group,
      input: InputConfiguration.cmaf(),
    });
  });

  test('validates segment duration within bounds', () => {
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf({
          duration: Duration.seconds(6),
        }),
        manifests: [Manifest.hls({ manifestName: 'index' })],
      });
    }).not.toThrow();
  });

  test('throws error for segment duration too short', () => {
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf({
          duration: Duration.seconds(0),
        }),
        manifests: [Manifest.hls({ manifestName: 'index' })],
      });
    }).toThrow(/Segment Duration needs to be between 1-30 seconds/);
  });

  test('throws error for segment duration too long', () => {
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf({
          duration: Duration.seconds(35),
        }),
        manifests: [Manifest.hls({ manifestName: 'index' })],
      });
    }).toThrow(/Segment Duration needs to be between 1-30 seconds/);
  });
});

describe('Manifest Validation', () => {
  let stack: Stack;
  let group: ChannelGroup;
  let channel: Channel;

  beforeEach(() => {
    stack = new Stack();
    group = new ChannelGroup(stack, 'Group');
    channel = new Channel(stack, 'Channel', {
      channelGroup: group,
      input: InputConfiguration.cmaf(),
    });
  });

  test('validates manifest window minimum', () => {
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf(),
        manifests: [
          Manifest.hls({
            manifestName: 'index',
            manifestWindow: Duration.seconds(20),
          }),
        ],
      });
    }).toThrow(/Manifest Window has a minimum value of 30 seconds/);
  });

  test('validates startover window bounds', () => {
    expect(() => {
      new OriginEndpoint(stack, 'Endpoint', {
        channel,
        segment: Segment.cmaf(),
        startoverWindow: Duration.seconds(50),
        manifests: [Manifest.hls({ manifestName: 'index' })],
      });
    }).toThrow(/Startover Window needs to be between 60-1209600 seconds/);
  });
});
