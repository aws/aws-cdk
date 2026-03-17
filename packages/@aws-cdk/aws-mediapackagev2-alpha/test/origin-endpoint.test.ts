import { Template } from 'aws-cdk-lib/assertions';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Effect, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { App, Bitrate, Duration, Stack } from 'aws-cdk-lib/core';
import * as mediapackagev2 from '../lib';

let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, undefined, {
    env: { account: '123456789012', region: 'us-east-1' },
  });
});

test('MediaPackagev2 Channel Group Configuration', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup', {
    channelGroupName: 'test',
    description: 'my test channel',
    tags: {
      env: 'dev',
    },
  });

  const channel = new mediapackagev2.Channel(stack, 'myChannel', {
    channelGroup: group,
    input: mediapackagev2.InputConfiguration.cmaf(),
    channelName: 'my-test-channel',
    description: 'a channel test',
    tags: {
      env: 'dev',
    },
  });

  new mediapackagev2.OriginEndpoint(stack, 'myendpoint', {
    channel,
    originEndpointName: 'my-test-endpoint',
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
      }),
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    ChannelGroupName: 'test',
    ChannelName: 'my-test-channel',
    OriginEndpointName: 'my-test-endpoint',
  });
});

test('MediaPackagev2 Channel Configuration - no names', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });
  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [
      mediapackagev2.Manifest.lowLatencyHLS({
        manifestName: 'index',
      }),
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
      }),
    ],
    startoverWindow: Duration.seconds(100),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    OriginEndpointName: 'origin',
    HlsManifests: [{ ManifestName: 'index' }],
    LowLatencyHlsManifests: [{ ManifestName: 'index' }],
    ContainerType: 'CMAF',
    StartoverWindowSeconds: 100,
  });
});

test('MediaPackagev2 Channel Configuration - no names imported', () => {
  const originEndpoint = mediapackagev2.OriginEndpoint.fromOriginEndpointAttributes(stack, 'ImportedEndpoint', {
    channelGroupName: 'MyChannelGroup',
    channelName: 'test',
    originEndpointName: 'endpoint',
  });

  expect(originEndpoint.originEndpointArn).toEqual('arn:aws:mediapackagev2:us-east-1:123456789012:channelGroup/MyChannelGroup/channel/test/originEndpoint/endpoint');
});

test('MediaPackagev2 Channel Configuration - encryption configuration', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  const role = new Role(stack, 'role', {
    assumedBy: new ServicePrincipal('mediapackagev2.amazonaws.com'),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
      }),
    ],
    startoverWindow: Duration.seconds(100),
    segment: mediapackagev2.Segment.cmaf({
      name: 'a',
      encryption: mediapackagev2.CmafEncryption.speke({
        method: mediapackagev2.CmafEncryptionMethod.CBCS,
        drmSystems: [mediapackagev2.CmafDrmSystem.FAIRPLAY],
        resourceId: 'abcdef',
        role,
        url: 'https://example.com/speke',
        keyRotationInterval: Duration.seconds(300),
      }),
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    OriginEndpointName: 'origin',
    HlsManifests: [{ ManifestName: 'index' }],
    ContainerType: 'CMAF',
    StartoverWindowSeconds: 100,
    Segment: {
      Encryption: {
        EncryptionMethod: {
          CmafEncryptionMethod: 'CBCS',
        },
        SpekeKeyProvider: {
          DrmSystems: ['FAIRPLAY'],
          EncryptionContractConfiguration: {
            PresetSpeke20Audio: 'PRESET-AUDIO-1',
            PresetSpeke20Video: 'PRESET-VIDEO-1',
          },
          ResourceId: 'abcdef',
          RoleArn: { 'Fn::GetAtt': ['roleC7B7E775', 'Arn'] },
          Url: 'https://example.com/speke',
        },
      },
    },
  });
});

test('MediaPackagev2 Channel Configuration - force endpoint error configuration', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
      }),
    ],
    startoverWindow: Duration.seconds(100),
    forceEndpointConfigurationConditions:
      [mediapackagev2.EndpointErrorConfiguration.INCOMPLETE_MANIFEST, mediapackagev2.EndpointErrorConfiguration.STALE_MANIFEST],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    OriginEndpointName: 'origin',
    ForceEndpointErrorConfiguration: { EndpointErrorConditions: ['INCOMPLETE_MANIFEST', 'STALE_MANIFEST'] },
    HlsManifests: [{ ManifestName: 'index' }],
    ContainerType: 'CMAF',
    StartoverWindowSeconds: 100,
  });
});

test('MediaPackagev2 Channel Configuration - filter configuration', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
        filterConfiguration: {
          end: new Date('2025-04-15T17:25:00Z'),
          start: new Date('2025-04-15T17:20:00Z'),
          timeDelay: Duration.seconds(1),
          manifestFilter: [mediapackagev2.ManifestFilter.numericRange(mediapackagev2.NumericFilterKey.AUDIO_SAMPLE_RATE, 0, 50000)],
        },
      }),
    ],
    startoverWindow: Duration.seconds(100),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    OriginEndpointName: 'origin',
    HlsManifests: [{
      ManifestName: 'index',
      FilterConfiguration: {
        End: '2025-04-15T17:25:00+00:00',
        ManifestFilter: 'audio_sample_rate:0-50000',
        Start: '2025-04-15T17:20:00+00:00',
        TimeDelaySeconds: 1,
      },
    }],
    ContainerType: 'CMAF',
    StartoverWindowSeconds: 100,
  });
});

test('drmSettings is rendered in filter configuration', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
        filterConfiguration: {
          drmSettings: [mediapackagev2.DrmSettingsKey.EXCLUDE_SESSION_KEYS],
        },
      }),
    ],
    segment: mediapackagev2.Segment.cmaf(),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    HlsManifests: [{
      ManifestName: 'index',
      FilterConfiguration: {
        DrmSettings: 'exclude_session_keys',
      },
    }],
  });
});

test('duplicate drmSettings are deduplicated', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
        filterConfiguration: {
          drmSettings: [mediapackagev2.DrmSettingsKey.EXCLUDE_SESSION_KEYS, mediapackagev2.DrmSettingsKey.EXCLUDE_SESSION_KEYS],
        },
      }),
    ],
    segment: mediapackagev2.Segment.cmaf(),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    HlsManifests: [{
      ManifestName: 'index',
      FilterConfiguration: {
        DrmSettings: 'exclude_session_keys',
      },
    }],
  });
});

test('MediaPackagev2 Channel Configuration - encryption configuration - filter configuration (end before start)', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  expect(()=>{
    new mediapackagev2.OriginEndpoint(stack, 'origin', {
      channel,
      segment: mediapackagev2.Segment.cmaf(),
      manifests: [
        mediapackagev2.Manifest.hls({
          manifestName: 'index',
          filterConfiguration: {
            end: new Date('2025-04-15T17:20:00Z'),
            start: new Date('2025-04-15T17:25:00Z'),
            manifestFilter: [mediapackagev2.ManifestFilter.numericRange(mediapackagev2.NumericFilterKey.AUDIO_SAMPLE_RATE, 0, 50000)],
            timeDelay: Duration.seconds(1),
          },
        }),
      ],
      startoverWindow: Duration.seconds(100),
    });
  }).toThrow('The End parameter needs to be after the Start parameter in a FilterConfiguration.');
});

test('MediaPackagev2 Channel Configuration - encryption configuration - filter configuration (configuration for clip start and start)', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  expect(()=>{
    new mediapackagev2.OriginEndpoint(stack, 'origin', {
      channel,
      segment: mediapackagev2.Segment.cmaf(),
      manifests: [
        mediapackagev2.Manifest.hls({
          manifestName: 'index',
          filterConfiguration: {
            end: new Date('2025-04-15T17:20:00Z'),
            clipStartTime: new Date('2025-04-15T17:25:00Z'),
            manifestFilter: [mediapackagev2.ManifestFilter.numericRange(mediapackagev2.NumericFilterKey.AUDIO_SAMPLE_RATE, 0, 50000)],
            timeDelay: Duration.seconds(1),
          },
        }),
      ],
      startoverWindow: Duration.seconds(100),
    });
  }).toThrow('You cannot specify both ClipStartTime with Start or End in a FilterConfiguration.');
});

test('MediaPackagev2 Channel Configuration - filter configuration multiple', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
        filterConfiguration: {
          end: new Date('2025-04-15T17:25:00Z'),
          start: new Date('2025-04-15T17:20:00Z'),
          timeDelay: Duration.seconds(1),
          manifestFilter: [
            mediapackagev2.ManifestFilter.numericRange(mediapackagev2.NumericFilterKey.AUDIO_SAMPLE_RATE, 0, 50000),
            mediapackagev2.ManifestFilter.numericRange(mediapackagev2.NumericFilterKey.VIDEO_FRAMERATE, 23.976, 30),
            mediapackagev2.ManifestFilter.videoCodec(mediapackagev2.VideoCodec.H264),
            mediapackagev2.ManifestFilter.numericRange(mediapackagev2.NumericFilterKey.VIDEO_HEIGHT, 720, 1080),
            mediapackagev2.ManifestFilter.textList(mediapackagev2.TextFilterKey.AUDIO_LANGUAGE, ['fr', 'en-US', 'de']),
          ],
        },
      }),
    ],
    startoverWindow: Duration.seconds(100),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    OriginEndpointName: 'origin',
    HlsManifests: [{
      ManifestName: 'index',
      FilterConfiguration: {
        End: '2025-04-15T17:25:00+00:00',
        ManifestFilter: 'audio_sample_rate:0-50000;video_framerate:23.976-30;video_codec:H264;video_height:720-1080;audio_language:fr,en-US,de',
        Start: '2025-04-15T17:20:00+00:00',
        TimeDelaySeconds: 1,
      },
    }],
    ContainerType: 'CMAF',
    StartoverWindowSeconds: 100,
  });
});

test('ManifestFilter bitrateRange renders correct filter string', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
        filterConfiguration: {
          manifestFilter: [
            mediapackagev2.ManifestFilter.bitrateRange(mediapackagev2.BitrateFilterKey.VIDEO_BITRATE, Bitrate.mbps(1), Bitrate.mbps(5)),
            mediapackagev2.ManifestFilter.bitrateRange(mediapackagev2.BitrateFilterKey.AUDIO_BITRATE, Bitrate.kbps(64), Bitrate.kbps(320)),
          ],
        },
      }),
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    HlsManifests: [{
      ManifestName: 'index',
      FilterConfiguration: {
        ManifestFilter: 'video_bitrate:1000000-5000000;audio_bitrate:64000-320000',
      },
    }],
  });
});

test('ManifestFilter bitrate rejects non-integer bps value', () => {
  expect(() => {
    mediapackagev2.ManifestFilter.bitrate(mediapackagev2.BitrateFilterKey.VIDEO_BITRATE, Bitrate.bps(1.5));
  }).toThrow(/must resolve to a whole number of bits per second, got 1.5/);
});

test('ManifestFilter bitrate rejects value exceeding max range', () => {
  expect(() => {
    mediapackagev2.ManifestFilter.bitrate(mediapackagev2.BitrateFilterKey.AUDIO_BITRATE, Bitrate.gbps(3));
  }).toThrow(/must be between 0 and 2147483647, got 3000000000/);
});

test('ManifestFilter numeric rejects value outside accepted range', () => {
  expect(() => {
    mediapackagev2.ManifestFilter.numeric(mediapackagev2.NumericFilterKey.AUDIO_CHANNELS, 0);
  }).toThrow(/must be between 1 and 32767, got 0/);

  expect(() => {
    mediapackagev2.ManifestFilter.numeric(mediapackagev2.NumericFilterKey.VIDEO_HEIGHT, 40000);
  }).toThrow(/must be between 1 and 32767, got 40000/);

  expect(() => {
    mediapackagev2.ManifestFilter.numericRange(mediapackagev2.NumericFilterKey.VIDEO_FRAMERATE, 0, 30);
  }).toThrow(/must be between 1 and 999.999, got 0/);
});

test('ManifestFilter numeric rejects non-integer for integer-only keys', () => {
  expect(() => {
    mediapackagev2.ManifestFilter.numeric(mediapackagev2.NumericFilterKey.AUDIO_CHANNELS, 2.5);
  }).toThrow(/must be an integer, got 2.5/);

  expect(() => {
    mediapackagev2.ManifestFilter.numeric(mediapackagev2.NumericFilterKey.VIDEO_HEIGHT, 720.5);
  }).toThrow(/must be an integer, got 720.5/);
});

test('ManifestFilter numeric rejects framerate with more than 3 decimal places', () => {
  expect(() => {
    mediapackagev2.ManifestFilter.numeric(mediapackagev2.NumericFilterKey.VIDEO_FRAMERATE, 23.9764);
  }).toThrow(/allows up to 3 decimal places, got 23.9764/);
});

test('Invalid time delay in filter configuration.', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  expect(()=>{
    new mediapackagev2.OriginEndpoint(stack, 'origin', {
      channel,
      segment: mediapackagev2.Segment.cmaf(),
      manifests: [
        mediapackagev2.Manifest.hls({
          manifestName: 'index',
          filterConfiguration: {
            timeDelay: Duration.days(140),
          },
        }),
      ],
      startoverWindow: Duration.seconds(100),
    });
  }).toThrow('Time Delay setting should be defined between 0-1209600 seconds.');
});

test('Invalid UTC timing modes with DASH configuration.', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  expect(()=>{
    new mediapackagev2.OriginEndpoint(stack, 'origin', {
      channel,
      segment: mediapackagev2.Segment.cmaf(),
      manifests: [
        mediapackagev2.Manifest.dash({
          manifestName: 'index',
          filterConfiguration: {
            timeDelay: Duration.days(140),
          },
          utcTimingMode: mediapackagev2.DashUtcTimingMode.UTC_DIRECT,
          utcTimingSource: 'aaa',
        }),
      ],
      startoverWindow: Duration.seconds(100),
    });
  }).toThrow('UTC Direct configured with a timing source, ensure timing source is undefined to use UTC Direct.');
});

test('MediaPackagev2 Channel Configuration - timezone specific (+08:00)', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
        filterConfiguration: {
          start: new Date('2025-05-27T10:00:00.000+08:00'),
          end: new Date('2025-05-27T16:00:00.000+08:00'),
        },
      }),
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    OriginEndpointName: 'origin',
    HlsManifests: [{
      ManifestName: 'index',
      FilterConfiguration: {
        End: '2025-05-27T08:00:00+00:00',
        Start: '2025-05-27T02:00:00+00:00',
      },
    }],
    ContainerType: 'CMAF',
  });
});

test('Attempt to configure ts options with cmaf in segment', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  expect(()=>{
    new mediapackagev2.OriginEndpoint(stack, 'origin', {
      channel,
      startoverWindow: Duration.seconds(100),
      manifests: [
        mediapackagev2.Manifest.hls({
          manifestName: 'first',
        }),
      ],
      segment: mediapackagev2.Segment.ts({
        scteFilter: [mediapackagev2.ScteMessageType.BREAK, mediapackagev2.ScteMessageType.DISTRIBUTOR_ADVERTISEMENT],
        includeDvbSubtitles: true,
        useAudioRenditionGroup: true,
        encryption: mediapackagev2.TsEncryption.speke({
          method: mediapackagev2.TsEncryptionMethod.SAMPLE_AES,
          drmSystems: [mediapackagev2.TsDrmSystem.FAIRPLAY],
          resourceId: 'abcdef',
          role: Role.fromRoleName(stack, 'testing-role', 'tester'),
          url: 'https://example.com/speke',
        }),
      }),
    });
  }).not.toThrow();
});

test('certificate is rendered in encryption configuration', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  const certificate = Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012');

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    manifests: [
      mediapackagev2.Manifest.hls({ manifestName: 'index' }),
    ],
    segment: mediapackagev2.Segment.cmaf({
      encryption: mediapackagev2.CmafEncryption.speke({
        method: mediapackagev2.CmafEncryptionMethod.CENC,
        drmSystems: [mediapackagev2.CmafDrmSystem.WIDEVINE],
        resourceId: 'abcdef',
        role: Role.fromRoleName(stack, 'testing-role', 'tester'),
        url: 'https://example.com/speke',
        certificate,
      }),
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    Segment: {
      Encryption: {
        SpekeKeyProvider: {
          CertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012',
        },
      },
    },
  });
});

test('ISM encryption renders correctly with IsmEncryption.speke()', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    manifests: [
      mediapackagev2.Manifest.mss({ manifestName: 'index' }),
    ],
    segment: mediapackagev2.Segment.ism({
      encryption: mediapackagev2.IsmEncryption.speke({
        drmSystems: [mediapackagev2.IsmDrmSystem.PLAYREADY],
        resourceId: 'abcdef',
        role: Role.fromRoleName(stack, 'testing-role', 'tester'),
        url: 'https://example.com/speke',
      }),
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    ContainerType: 'ISM',
    Segment: {
      Encryption: {
        EncryptionMethod: {
          CmafEncryptionMethod: 'CENC',
        },
        SpekeKeyProvider: {
          DrmSystems: ['PLAYREADY'],
          EncryptionContractConfiguration: {
            PresetSpeke20Audio: 'SHARED',
            PresetSpeke20Video: 'SHARED',
          },
          ResourceId: 'abcdef',
          Url: 'https://example.com/speke',
        },
      },
    },
  });
});

test('TS encryption renders correctly with TsEncryption.speke()', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    manifests: [
      mediapackagev2.Manifest.hls({ manifestName: 'index' }),
    ],
    segment: mediapackagev2.Segment.ts({
      encryption: mediapackagev2.TsEncryption.speke({
        method: mediapackagev2.TsEncryptionMethod.SAMPLE_AES,
        drmSystems: [mediapackagev2.TsDrmSystem.FAIRPLAY],
        resourceId: 'abcdef',
        role: Role.fromRoleName(stack, 'testing-role', 'tester'),
        url: 'https://example.com/speke',
      }),
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    ContainerType: 'TS',
    Segment: {
      Encryption: {
        EncryptionMethod: {
          TsEncryptionMethod: 'SAMPLE_AES',
        },
        SpekeKeyProvider: {
          DrmSystems: ['FAIRPLAY'],
          EncryptionContractConfiguration: {
            PresetSpeke20Audio: 'PRESET-AUDIO-1',
            PresetSpeke20Video: 'PRESET-VIDEO-1',
          },
          ResourceId: 'abcdef',
          Url: 'https://example.com/speke',
        },
      },
    },
  });
});

test('CMAF encryption with excludeSegmentDrmMetadata renders correctly', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    manifests: [
      mediapackagev2.Manifest.hls({ manifestName: 'index' }),
    ],
    segment: mediapackagev2.Segment.cmaf({
      encryption: mediapackagev2.CmafEncryption.speke({
        method: mediapackagev2.CmafEncryptionMethod.CBCS,
        drmSystems: [mediapackagev2.CmafDrmSystem.FAIRPLAY],
        resourceId: 'abcdef',
        role: Role.fromRoleName(stack, 'testing-role', 'tester'),
        url: 'https://example.com/speke',
        excludeSegmentDrmMetadata: true,
      }),
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    Segment: {
      Encryption: {
        CmafExcludeSegmentDrmMetadata: true,
      },
    },
  });
});

test('MSS manifest layout is rendered correctly', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    manifests: [
      mediapackagev2.Manifest.mss({
        manifestName: 'index',
        manifestLayout: mediapackagev2.MssManifestLayout.COMPACT,
      }),
    ],
    segment: mediapackagev2.Segment.ism(),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    MssManifests: [{
      ManifestName: 'index',
      ManifestLayout: 'COMPACT',
    }],
  });
});

test('scteInSegments is rendered in segment configuration', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    manifests: [
      mediapackagev2.Manifest.hls({ manifestName: 'index' }),
    ],
    segment: mediapackagev2.Segment.cmaf({
      scteFilter: [mediapackagev2.ScteMessageType.BREAK],
      scteInSegments: mediapackagev2.ScteInSegments.ALL,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    Segment: {
      Scte: {
        ScteFilter: ['BREAK'],
        ScteInSegments: 'ALL',
      },
    },
  });
});

test('Test Segment settings for TS container types', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    startoverWindow: Duration.seconds(100),
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
      }),
    ],
    segment: mediapackagev2.Segment.ts({
      scteFilter: [mediapackagev2.ScteMessageType.BREAK, mediapackagev2.ScteMessageType.DISTRIBUTOR_ADVERTISEMENT],
      includeDvbSubtitles: true,
      useAudioRenditionGroup: true,
      includeIframeOnlyStreams: false,
      duration: Duration.seconds(2),
      name: 'mysegment',
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpoint', {
    OriginEndpointName: 'origin',
    HlsManifests: [{
      ManifestName: 'index',
    }],
    Segment: {
      IncludeIframeOnlyStreams: false,
      Scte: { ScteFilter: ['BREAK', 'DISTRIBUTOR_ADVERTISEMENT'] },
      SegmentDurationSeconds: 2,
      SegmentName: 'mysegment',
      TsIncludeDvbSubtitles: true,
      TsUseAudioRenditionGroup: true,
    },
    ContainerType: 'TS',
    StartoverWindowSeconds: 100,
  });
});

test('addToResourcePolicy for OriginEndpoint', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  const distribution: Distribution = new Distribution(stack, 'cdn', {
    defaultBehavior: {
      origin: new HttpOrigin(channelGroup.egressDomain),
    },
  });

  const endpoint = new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    startoverWindow: Duration.seconds(100),
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
      }),
    ],
    segment: mediapackagev2.Segment.ts({
      scteFilter: [mediapackagev2.ScteMessageType.BREAK, mediapackagev2.ScteMessageType.DISTRIBUTOR_ADVERTISEMENT],
      includeDvbSubtitles: true,
      useAudioRenditionGroup: true,
      includeIframeOnlyStreams: false,
      duration: Duration.seconds(2),
      name: 'mysegment',
    }),
  });
  endpoint.addToResourcePolicy(new PolicyStatement({
    sid: 'AllowRequestsFromCloudFront',
    effect: Effect.ALLOW,
    actions: [
      'mediapackagev2:GetObject',
      'mediapackagev2:GetHeadObject',
    ],
    principals: [
      new ServicePrincipal('cloudfront.amazonaws.com'),
    ],
    resources: [endpoint.originEndpointArn],
    conditions: {
      StringEquals: {
        'aws:SourceArn': [`arn:aws:cloudfront::1234567890:distribution/${distribution.distributionId}`],
      },
    },
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpointPolicy', {
    ChannelGroupName: 'MyChannelGroup',
    ChannelName: 'mychannel',
    OriginEndpointName: 'origin',
    Policy: {
      Statement: [{
        Action: ['mediapackagev2:GetObject', 'mediapackagev2:GetHeadObject'],
        Condition: {
          StringEquals: {
            'aws:SourceArn': [{
              'Fn::Join': ['', ['arn:aws:cloudfront::1234567890:distribution/', { Ref: 'cdnE31FB0B1' }]],
            }],
          },
        },
        Effect: 'Allow',
        Principal: {
          Service: 'cloudfront.amazonaws.com',
        },
        Resource: {
          'Fn::GetAtt': ['origin7345F895', 'Arn'],
        },
        Sid: 'AllowRequestsFromCloudFront',
      }],
      Version: '2012-10-17',
    },
  });
});

test('Create resources using helper functions', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'group');
  const channel = channelGroup.addChannel('channel', {
    channelName: 'example-channel',
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  const distribution: Distribution = new Distribution(stack, 'cdn', {
    defaultBehavior: {
      origin: new HttpOrigin(channelGroup.egressDomain),
    },
  });

  const endpoint = channel.addOriginEndpoint('endpoint1', {
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
        filterConfiguration: {
          end: new Date('2025-04-15T17:25:00Z'),
          start: new Date('2025-04-15T17:20:00Z'),
          timeDelay: Duration.seconds(10),
          manifestFilter: [
            mediapackagev2.ManifestFilter.numericRange(mediapackagev2.NumericFilterKey.AUDIO_SAMPLE_RATE, 0, 50000),
            mediapackagev2.ManifestFilter.numericRange(mediapackagev2.NumericFilterKey.VIDEO_FRAMERATE, 23.976, 30),
            mediapackagev2.ManifestFilter.videoCodec(mediapackagev2.VideoCodec.H264),
            mediapackagev2.ManifestFilter.numericList(mediapackagev2.NumericFilterKey.VIDEO_HEIGHT, [240, 360]),
            mediapackagev2.ManifestFilter.textList(mediapackagev2.TextFilterKey.AUDIO_LANGUAGE, ['fr', 'en-US', 'de']),
          ],
        },
      }),
    ],
    startoverWindow: Duration.seconds(100),
  });

  endpoint.addToResourcePolicy(new PolicyStatement({
    sid: 'AllowRequestsFromCloudFront',
    effect: Effect.ALLOW,
    actions: [
      'mediapackagev2:GetObject',
      'mediapackagev2:GetHeadObject',
    ],
    principals: [
      new ServicePrincipal('cloudfront.amazonaws.com'),
    ],
    resources: [endpoint.originEndpointArn],
    conditions: {
      StringEquals: {
        'aws:SourceArn': [`arn:aws:cloudfront::1234567890:distribution/${distribution.distributionId}`],
      },
    },
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpointPolicy', {
    ChannelGroupName: 'group',
    ChannelName: 'example-channel',
    OriginEndpointName: 'groupchannelendpoint164D53E53',
    Policy: {
      Statement: [{
        Action: ['mediapackagev2:GetObject', 'mediapackagev2:GetHeadObject'],
        Condition: {
          StringEquals: {
            'aws:SourceArn': [{
              'Fn::Join': ['', ['arn:aws:cloudfront::1234567890:distribution/', { Ref: 'cdnE31FB0B1' }]],
            }],
          },
        },
        Effect: 'Allow',
        Principal: {
          Service: 'cloudfront.amazonaws.com',
        },
        Resource: {
          'Fn::GetAtt': ['groupchannelendpoint1A5067AD4', 'Arn'],
        },
        Sid: 'AllowRequestsFromCloudFront',
      }],
      Version: '2012-10-17',
    },
  });
});

test('addToResourcePolicy with CDN auth configuration for OriginEndpoint', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  const cdnRole = new Role(stack, 'CdnAuthRole', {
    assumedBy: new ServicePrincipal('mediapackagev2.amazonaws.com'),
  });

  const secret1 = new Secret(stack, 'CdnSecret1');
  const secret2 = new Secret(stack, 'CdnSecret2');

  const endpoint = new mediapackagev2.OriginEndpoint(stack, 'origin', {
    channel,
    segment: mediapackagev2.Segment.ts(),
    startoverWindow: Duration.seconds(100),
    manifests: [
      mediapackagev2.Manifest.hls({
        manifestName: 'index',
      }),
    ],
  });

  const cdnAuthPolicy = new PolicyStatement({
    effect: Effect.ALLOW,
    principals: [new ServicePrincipal('*')],
    actions: ['mediapackagev2:GetObject'],
    resources: [endpoint.originEndpointArn],
    conditions: {
      Bool: {
        'mediapackagev2:RequestHasMatchingCdnAuthHeader': true,
      },
    },
  });

  endpoint.addToResourcePolicy(cdnAuthPolicy, {
    secrets: [secret1, secret2],
    role: cdnRole,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::OriginEndpointPolicy', {
    ChannelGroupName: 'MyChannelGroup',
    ChannelName: 'mychannel',
    OriginEndpointName: 'origin',
    CdnAuthConfiguration: {
      CdnIdentifierSecretArns: [
        { Ref: 'CdnSecret10BDCCDFE' },
        { Ref: 'CdnSecret2234959AA' },
      ],
      SecretsRoleArn: {
        'Fn::GetAtt': ['CdnAuthRoleFC2973E6', 'Arn'],
      },
    },
    Policy: {
      Statement: [{
        Action: 'mediapackagev2:GetObject',
        Condition: {
          Bool: {
            'mediapackagev2:RequestHasMatchingCdnAuthHeader': true,
          },
        },
        Effect: 'Allow',
        Principal: {
          Service: '*.amazonaws.com',
        },
        Resource: {
          'Fn::GetAtt': ['origin7345F895', 'Arn'],
        },
      }],
      Version: '2012-10-17',
    },
  });
});

test('Origin Endpoint name validation - too short', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  expect(() => {
    new mediapackagev2.OriginEndpoint(stack, 'origin', {
      channel,
      originEndpointName: '',
      segment: mediapackagev2.Segment.ts(),
      manifests: [
        mediapackagev2.Manifest.hls({
          manifestName: 'index',
        }),
      ],
    });
  }).toThrow('Origin endpoint name must be between 1 and 256 characters in length.');
});

test('Origin Endpoint name validation - too long', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  expect(() => {
    new mediapackagev2.OriginEndpoint(stack, 'origin', {
      channel,
      originEndpointName: 'a'.repeat(257),
      segment: mediapackagev2.Segment.ts(),
      manifests: [
        mediapackagev2.Manifest.hls({
          manifestName: 'index',
        }),
      ],
    });
  }).toThrow('Origin endpoint name must be between 1 and 256 characters in length.');
});

test('Origin Endpoint name validation - invalid characters', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  expect(() => {
    new mediapackagev2.OriginEndpoint(stack, 'origin', {
      channel,
      originEndpointName: 'invalid@name',
      segment: mediapackagev2.Segment.ts(),
      manifests: [
        mediapackagev2.Manifest.hls({
          manifestName: 'index',
        }),
      ],
    });
  }).toThrow('Origin endpoint name must only contain alphanumeric characters, hyphens, and underscores.');
});

test('Origin Endpoint description validation - too long', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'mychannel', {
    channelGroup,
    input: mediapackagev2.InputConfiguration.hls(),
  });

  expect(() => {
    new mediapackagev2.OriginEndpoint(stack, 'origin', {
      channel,
      description: 'a'.repeat(1025),
      segment: mediapackagev2.Segment.ts(),
      manifests: [
        mediapackagev2.Manifest.hls({
          manifestName: 'index',
        }),
      ],
    });
  }).toThrow('Origin endpoint description must not exceed 1024 characters.');
});

test('origin endpoint metrics', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup', {
    channelGroupName: 'test-group',
  });
  const channel = new mediapackagev2.Channel(stack, 'myChannel', {
    channelGroup: group,
    channelName: 'test-channel',
    input: mediapackagev2.InputConfiguration.cmaf(),
  });
  const endpoint = new mediapackagev2.OriginEndpoint(stack, 'myEndpoint', {
    channel,
    originEndpointName: 'test-endpoint',
    segment: mediapackagev2.Segment.cmaf(),
    manifests: [
      mediapackagev2.Manifest.hls({ manifestName: 'index' }),
    ],
  });

  expect(stack.resolve(endpoint.metricIngressBytes())).toEqual(expect.objectContaining({
    dimensions: { ChannelGroup: 'test-group', Channel: 'test-channel', OriginEndpoint: 'test-endpoint' },
    namespace: 'AWS/MediaPackage',
    metricName: 'IngressBytes',
    statistic: 'Sum',
    unit: 'Bytes',
  }));

  expect(stack.resolve(endpoint.metricEgressBytes())).toEqual(expect.objectContaining({
    dimensions: { ChannelGroup: 'test-group', Channel: 'test-channel', OriginEndpoint: 'test-endpoint' },
    namespace: 'AWS/MediaPackage',
    metricName: 'EgressBytes',
    statistic: 'Sum',
    unit: 'Bytes',
  }));

  expect(stack.resolve(endpoint.metricIngressResponseTime())).toEqual(expect.objectContaining({
    dimensions: { ChannelGroup: 'test-group', Channel: 'test-channel', OriginEndpoint: 'test-endpoint' },
    namespace: 'AWS/MediaPackage',
    metricName: 'IngressResponseTime',
    statistic: 'Average',
    unit: 'Milliseconds',
  }));

  expect(stack.resolve(endpoint.metricEgressResponseTime())).toEqual(expect.objectContaining({
    dimensions: { ChannelGroup: 'test-group', Channel: 'test-channel', OriginEndpoint: 'test-endpoint' },
    namespace: 'AWS/MediaPackage',
    metricName: 'EgressResponseTime',
    statistic: 'Average',
    unit: 'Milliseconds',
  }));

  expect(stack.resolve(endpoint.metricIngressRequestCount())).toEqual(expect.objectContaining({
    dimensions: { ChannelGroup: 'test-group', Channel: 'test-channel', OriginEndpoint: 'test-endpoint' },
    namespace: 'AWS/MediaPackage',
    metricName: 'IngressRequestCount',
    statistic: 'Sum',
    unit: 'Count',
  }));

  expect(stack.resolve(endpoint.metricEgressRequestCount())).toEqual(expect.objectContaining({
    dimensions: { ChannelGroup: 'test-group', Channel: 'test-channel', OriginEndpoint: 'test-endpoint' },
    namespace: 'AWS/MediaPackage',
    metricName: 'EgressRequestCount',
    statistic: 'Sum',
    unit: 'Count',
  }));
});
