import { Duration } from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib/core';
import {
  CmafEncryption,
  CmafEncryptionMethod,
  TsEncryption,
  TsEncryptionMethod,
  IsmEncryption,
  CmafDrmSystem,
  TsDrmSystem,
  IsmDrmSystem,
  PresetSpeke20Audio,
  PresetSpeke20Video,
  Segment,
  ScteMessageType,
  StartTag,
} from '../lib';

describe('Encryption Helper', () => {
  let stack: Stack;
  let role: Role;

  beforeEach(() => {
    stack = new Stack();
    role = new Role(stack, 'Role', {
      assumedBy: new ServicePrincipal('mediapackagev2.amazonaws.com'),
    });
  });

  test('CmafEncryption.speke binds correct encryption property', () => {
    const encryption = CmafEncryption.speke({
      method: CmafEncryptionMethod.CBCS,
      drmSystems: [CmafDrmSystem.FAIRPLAY],
      resourceId: 'test-resource-id',
      role: role,
      url: 'https://example.com/speke',
    });

    const result = encryption._bind(stack);
    expect(result).toEqual(expect.objectContaining({
      encryptionMethod: { cmafEncryptionMethod: 'CBCS' },
      spekeKeyProvider: expect.objectContaining({
        drmSystems: ['FAIRPLAY'],
        resourceId: 'test-resource-id',
        url: 'https://example.com/speke',
        encryptionContractConfiguration: {
          presetSpeke20Audio: 'PRESET_AUDIO_1',
          presetSpeke20Video: 'PRESET_VIDEO_1',
        },
      }),
    }));
  });

  test('CmafEncryption.speke with optional parameters', () => {
    const encryption = CmafEncryption.speke({
      method: CmafEncryptionMethod.CENC,
      drmSystems: [CmafDrmSystem.WIDEVINE, CmafDrmSystem.PLAYREADY],
      resourceId: 'test-resource-id',
      role: role,
      url: 'https://example.com/speke',
      constantInitializationVector: '12345678901234567890123456789012',
      keyRotationInterval: Duration.seconds(300),
      audioPreset: PresetSpeke20Audio.SHARED,
      videoPreset: PresetSpeke20Video.SHARED,
      excludeSegmentDrmMetadata: true,
    });

    const result = encryption._bind(stack);
    expect(result).toEqual(expect.objectContaining({
      constantInitializationVector: '12345678901234567890123456789012',
      keyRotationIntervalSeconds: 300,
      cmafExcludeSegmentDrmMetadata: true,
      spekeKeyProvider: expect.objectContaining({
        encryptionContractConfiguration: {
          presetSpeke20Audio: 'SHARED',
          presetSpeke20Video: 'SHARED',
        },
      }),
    }));
  });

  test('TsEncryption.speke binds correct encryption property', () => {
    const encryption = TsEncryption.speke({
      method: TsEncryptionMethod.SAMPLE_AES,
      drmSystems: [TsDrmSystem.FAIRPLAY],
      resourceId: 'test-resource-id',
      role: role,
      url: 'https://example.com/speke',
    });

    const result = encryption._bind(stack);
    expect(result).toEqual(expect.objectContaining({
      encryptionMethod: { tsEncryptionMethod: 'SAMPLE_AES' },
      spekeKeyProvider: expect.objectContaining({
        encryptionContractConfiguration: {
          presetSpeke20Audio: 'PRESET_AUDIO_1',
          presetSpeke20Video: 'PRESET_VIDEO_1',
        },
      }),
    }));
  });

  test('IsmEncryption.speke binds with SHARED presets and CENC', () => {
    const encryption = IsmEncryption.speke({
      drmSystems: [IsmDrmSystem.PLAYREADY],
      resourceId: 'test-resource-id',
      role: role,
      url: 'https://example.com/speke',
    });

    const result = encryption._bind(stack);
    expect(result).toEqual(expect.objectContaining({
      encryptionMethod: { ismEncryptionMethod: 'CENC' },
      spekeKeyProvider: expect.objectContaining({
        encryptionContractConfiguration: {
          presetSpeke20Audio: 'SHARED',
          presetSpeke20Video: 'SHARED',
        },
      }),
    }));
    expect(result.keyRotationIntervalSeconds).toBeUndefined();
    expect(result.constantInitializationVector).toBeUndefined();
  });

  test('CmafEncryption.speke returns role from _getRole', () => {
    const encryption = CmafEncryption.speke({
      method: CmafEncryptionMethod.CBCS,
      drmSystems: [CmafDrmSystem.FAIRPLAY],
      resourceId: 'test',
      role: role,
      url: 'https://example.com/speke',
    });
    expect(encryption._getRole()).toBe(role);
  });
});

describe('Segment Helper', () => {
  test('Segment.ts creates correct SegmentConfiguration object', () => {
    const segment = Segment.ts({
      duration: Duration.seconds(6),
      name: 'test-segment',
      includeDvbSubtitles: true,
      useAudioRenditionGroup: true,
      includeIframeOnlyStreams: true,
      scteFilter: [ScteMessageType.BREAK],
    });

    expect(segment.segmentDuration).toEqual(Duration.seconds(6));
    expect(segment.segmentName).toBe('test-segment');
    expect(segment.tsIncludeDvbSubtitles).toBe(true);
    expect(segment.tsUseAudioRenditionGroup).toBe(true);
    expect(segment.includeIframeOnlyStreams).toBe(true);
    expect(segment.scteFilter).toEqual([ScteMessageType.BREAK]);
  });

  test('Segment.ts with defaults', () => {
    const segment = Segment.ts();

    expect(segment.segmentDuration).toBeUndefined();
    expect(segment.segmentName).toBeUndefined();
    expect(segment.tsIncludeDvbSubtitles).toBeUndefined();
    expect(segment.tsUseAudioRenditionGroup).toBeUndefined();
    expect(segment.includeIframeOnlyStreams).toBeUndefined();
    expect(segment.scteFilter).toBeUndefined();
  });

  test('Segment.cmaf creates correct SegmentConfiguration object', () => {
    const segment = Segment.cmaf({
      duration: Duration.seconds(4),
      name: 'cmaf-segment',
      includeIframeOnlyStreams: true,
      scteFilter: [ScteMessageType.DISTRIBUTOR_ADVERTISEMENT],
    });

    expect(segment.segmentDuration).toEqual(Duration.seconds(4));
    expect(segment.segmentName).toBe('cmaf-segment');
    expect(segment.includeIframeOnlyStreams).toBe(true);
    expect(segment.scteFilter).toEqual([ScteMessageType.DISTRIBUTOR_ADVERTISEMENT]);
  });

  test('Segment.cmaf sets TS-specific options to undefined', () => {
    const segment = Segment.cmaf({
      duration: Duration.seconds(6),
    });

    expect(segment.tsIncludeDvbSubtitles).toBeUndefined();
    expect(segment.tsUseAudioRenditionGroup).toBeUndefined();
  });

  test('Segment.cmaf with defaults', () => {
    const segment = Segment.cmaf();

    expect(segment.segmentDuration).toBeUndefined();
    expect(segment.segmentName).toBeUndefined();
    expect(segment.includeIframeOnlyStreams).toBeUndefined();
    expect(segment.scteFilter).toBeUndefined();
    expect(segment.tsIncludeDvbSubtitles).toBeUndefined();
    expect(segment.tsUseAudioRenditionGroup).toBeUndefined();
  });
});

describe('StartTag Helper', () => {
  test('StartTag.of creates correct IStartTag object with positive offset', () => {
    const startTag = StartTag.of(10);

    expect(startTag.timeOffset).toBe(10);
    expect(startTag.precise).toBeUndefined();
  });

  test('StartTag.of creates correct IStartTag object with negative offset', () => {
    const startTag = StartTag.of(-30);

    expect(startTag.timeOffset).toBe(-30);
    expect(startTag.precise).toBeUndefined();
  });

  test('StartTag.of with precise option', () => {
    const startTag = StartTag.of(10, { precise: true });

    expect(startTag.timeOffset).toBe(10);
    expect(startTag.precise).toBe(true);
  });

  test('StartTag.of with precise false', () => {
    const startTag = StartTag.of(10, { precise: false });

    expect(startTag.timeOffset).toBe(10);
    expect(startTag.precise).toBe(false);
  });

  test('StartTag.withPrecise creates IStartTag with precise=true', () => {
    const startTag = StartTag.withPrecise(15);

    expect(startTag.timeOffset).toBe(15);
    expect(startTag.precise).toBe(true);
  });

  test('StartTag.withPrecise with negative offset', () => {
    const startTag = StartTag.withPrecise(-45);

    expect(startTag.timeOffset).toBe(-45);
    expect(startTag.precise).toBe(true);
  });

  test('StartTag.of with zero offset', () => {
    const startTag = StartTag.of(0);

    expect(startTag.timeOffset).toBe(0);
    expect(startTag.precise).toBeUndefined();
  });
});
