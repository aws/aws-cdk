# AWS::MediaPackageV2 Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Developer Preview](https://img.shields.io/badge/cdk--constructs-developer--preview-informational.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are in **developer preview** before they
> become stable. We will only make breaking changes to address unforeseen API issues. Therefore,
> these APIs are not subject to [Semantic Versioning](https://semver.org/), and breaking changes
> will be announced in release notes. This means that while you may use them, you may need to
> update your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

## AWS Elemental MediaPackage V2

MediaPackage delivers high-quality video without concern for capacity and makes it easier to implement popular DVR features such as start over, pause, and rewind. Your content will be protected with comprehensive support for DRM. The service seamlessly integrates with other AWS media services as a complete set of tools for cloud-based video processing and delivery.

This package contains constructs for working with AWS Elemental MediaPackage V2. Allowing you to define AWS Elemental MediaPackage V2 Channel Groups, Channels, Origin Endpoints, Channel Policies and Origin Endpoint Policies.

For further information on AWS Elemental MediaPackage V2, see [the documentation](https://aws.amazon.com/mediapackage/).

The following example creates an AWS Elemental MediaPackage V2 Channel Group, Channel and Origin Endpoint:

```ts
declare const stack: Stack;
const group = new ChannelGroup(stack, 'MyChannelGroup', {
    channelGroupName: 'my-test-channel-group',
});

const channel = new Channel(stack, 'MyChannel', {
    channelGroup: group,
    channelName: 'my-testchannel',
    input: InputConfiguration.cmaf(),
});

const endpoint = new OriginEndpoint(stack, 'MyOriginEndpoint', {
    channel,
    originEndpointName: 'my-test-endpoint',
    segment: Segment.cmaf(),
    manifests: [Manifest.hls({
        manifestName: 'index',
    })],
});
```

## Using Factory Methods

```ts
declare const stack: Stack;

// Create a channel group
const group = new ChannelGroup(stack, 'MyChannelGroup', {
  channelGroupName: 'my-channel-group',
});

// Add a channel using the factory method
const channel = group.addChannel('MyChannel', {
  channelName: 'my-channel',
  input: InputConfiguration.cmaf(),
});

// Add an origin endpoint using the factory method
const endpoint = channel.addOriginEndpoint('MyEndpoint', {
  originEndpointName: 'my-endpoint',
  segment: Segment.cmaf(),
  manifests: [Manifest.hls({ manifestName: 'index' })],
});
```

## Channel Group

A channel group is the top-level resource that consists of channels and origin endpoints associated with it.

The following code creates a Channel Group:

```ts
declare const stack: Stack;
const group = new ChannelGroup(stack, 'MyChannelGroup', {
    channelGroupName: 'my-test-channel-group',
});
```

The following code imports an existing channel group using the name attribute:

```ts
declare const stack: Stack;
const channelGroup = ChannelGroup.fromChannelGroupAttributes(stack, 'ImportedChannelGroup', {
    channelGroupName: 'MyChannelGroup',
});
```

## Channel

A channel is part of a channel group and represents the entry point for a content stream into MediaPackage.

### Input Configuration

Channels support two input types: HLS and CMAF.

```ts
declare const stack: Stack;
declare const group: ChannelGroup;

const hlsChannel = new Channel(stack, 'HlsChannel', {
  channelGroup: group,
  input: InputConfiguration.hls(),
});

const cmafChannel = new Channel(stack, 'CmafChannel', {
  channelGroup: group,
  input: InputConfiguration.cmaf({
    inputSwitchConfiguration: {
      mqcsInputSwitching: true,
    },
    outputHeaders: [HeadersCMSD.MQCS],
  }),
});

const simpleCmafChannel = new Channel(stack, 'SimpleCmafChannel', {
  channelGroup: group,
  input: InputConfiguration.cmaf({
    outputHeaders: [HeadersCMSD.MQCS],
  }),
});
```

### Importing an Existing Channel

The following code imports an existing channel using the name attributes:

```ts
declare const stack: Stack;
const channel = Channel.fromChannelAttributes(stack, 'ImportedChannel', {
    channelName: 'MyChannel',
    channelGroupName: 'MyChannelGroup',
});
```

### Channel Resource Policy

The following code creates a resource policy directly on the channel. This 
will automatically create a policy on the first call:

```ts
declare const channel: Channel;
channel.addToResourcePolicy(new PolicyStatement({
    sid: 'AllowMediaLiveRoleToAccessEmpChannel',
    principals: [new ArnPrincipal('arn:aws:iam::AccountID:role/MediaLiveAccessRole')],
    effect: Effect.ALLOW,
    actions: ['mediapackagev2:PutObject'],
    resources: [channel.channelArn],
}));
```

## Origin Endpoint

```ts
declare const stack: Stack;
declare const channel: Channel;
new OriginEndpoint(stack, 'myendpoint', {
    channel,
    originEndpointName: 'my-test-endpoint',
    segment: Segment.cmaf(),
    manifests: [
      Manifest.hls({
        manifestName: 'index',
      }),
    ],
});
```

The following code imports an existing origin endpoint using the name attributes:

```ts
declare const stack: Stack;
const originEndpoint = OriginEndpoint.fromOriginEndpointAttributes(stack, 'ImportedOriginEndpoint', {
    channelGroupName: 'MyChannelGroup',
    channelName: 'MyChannel',
    originEndpointName: 'MyExampleOriginEndpoint',
});
```

The following code creates a resource policy on the origin endpoint. This 
will automatically create a policy on the first call:

```ts
declare const origin: OriginEndpoint;

origin.addToResourcePolicy(new PolicyStatement({
    sid: 'AllowRequestsFromCloudFront',
    principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
    effect: Effect.ALLOW,
    actions: ['mediapackagev2:GetHeadObject', 'mediapackagev2:GetObject'],
    resources: [origin.originEndpointArn],
    conditions: {
      StringEquals: {
        'aws:SourceArn': 'arn:aws:cloudfront::123456789012:distribution/AAAAAAAAA',
      },
    },
}));
```

## Granting Permissions

### Granting Ingest Access to MediaLive

To allow AWS Elemental MediaLive to ingest content into a MediaPackage channel, use the `grantIngest()` method:

```ts
declare const channel: Channel;
declare const mediaLiveRole: iam.IRole;

// Grant MediaLive permission to ingest content
channel.grantIngest(mediaLiveRole);
```

### CloudFront Integration

MediaPackage origin endpoints are designed to be used with Content Delivery Network (CDN) like Amazon CloudFront distributions. CloudFront provides caching, DDoS protection, and global content delivery for your streaming content.

To allow a CloudFront distribution to access a MediaPackage origin endpoint, add a resource policy with the CloudFront service principal:

```ts
declare const originEndpoint: OriginEndpoint;
declare const distribution: cloudfront.Distribution;

originEndpoint.addToResourcePolicy(new iam.PolicyStatement({
  sid: 'AllowCloudFrontServicePrincipal',
  principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
  effect: iam.Effect.ALLOW,
  actions: ['mediapackagev2:GetObject'],
  resources: [originEndpoint.originEndpointArn],
  conditions: {
    StringEquals: {
      'aws:SourceArn': distribution.distributionArn,
    },
  },
}));
```

You can complete the confirmation with an OAC (Origin Access Control) Policy on the CloudFront Distribution.

## Manifest Configuration

MediaPackage V2 supports multiple manifest formats: HLS, Low-Latency HLS (LL-HLS), DASH, and Microsoft Smooth Streaming (MSS).

### HLS Manifests

```ts
declare const channel: Channel;

new OriginEndpoint(this, 'Endpoint', {
  channel,
  segment: Segment.cmaf(),
  manifests: [
    Manifest.hls({
      manifestName: 'index',
      manifestWindow: Duration.seconds(60),
      programDateTimeInterval: Duration.seconds(60),
      scteAdMarkerHls: AdMarkerHls.DATERANGE,
    }),
  ],
});
```

### Low-Latency HLS Manifests

```ts
declare const channel: Channel;

new OriginEndpoint(this, 'Endpoint', {
  channel,
  segment: Segment.cmaf(),
  manifests: [
    Manifest.lowLatencyHLS({
      manifestName: 'index',
      manifestWindow: Duration.seconds(30),
      programDateTimeInterval: Duration.seconds(5),
      childManifestName: 'child',
    }),
  ],
});
```

### DASH Manifests

```ts
declare const channel: Channel;

new OriginEndpoint(this, 'Endpoint', {
  channel,
  segment: Segment.cmaf(),
  manifests: [
    Manifest.dash({
      manifestName: 'index',
      manifestWindow: Duration.seconds(60),
      minBufferTime: Duration.seconds(30),
      minUpdatePeriod: Duration.seconds(10),
      segmentTemplateFormat: SegmentTemplateFormat.NUMBER_WITH_TIMELINE,
      periodTriggers: [
        DashPeriodTriggers.AVAILS,
        DashPeriodTriggers.DRM_KEY_ROTATION,
      ],
    }),
  ],
});
```

### MSS Manifests

```ts
declare const channel: Channel;

new OriginEndpoint(this, 'Endpoint', {
  channel,
  segment: Segment.ism(),
  manifests: [
    Manifest.mss({
      manifestName: 'index',
      manifestWindow: Duration.seconds(60),
      manifestLayout: MssManifestLayout.COMPACT,
    }),
  ],
});
```

### Multiple Manifests

You can configure multiple manifest formats for a single origin endpoint:

```ts
declare const channel: Channel;

new OriginEndpoint(this, 'Endpoint', {
  channel,
  segment: Segment.cmaf(),
  manifests: [
    Manifest.hls({ manifestName: 'hls' }),
    Manifest.dash({ manifestName: 'dash' }),
  ],
});
```

## Manifest Filtering

Manifest filters control which variants are included in the manifest. Filters are type-safe and validated against the [MediaPackage manifest filtering rules](https://docs.aws.amazon.com/mediapackage/latest/userguide/manifest-filter-query-parameters.html).

| Filter | Method |
|--------|--------|
| Audio / video bitrate | `bitrate()`, `bitrateRange()`, `bitrateCombo()` |
| Audio channels, sample rate, video height, framerate, trickplay height | `numeric()`, `numericList()`, `numericRange()`, `numericCombo()` |
| Audio codec | `audioCodec()`, `audioCodecList()` |
| Video codec | `videoCodec()`, `videoCodecList()` |
| Video dynamic range | `videoDynamicRange()`, `videoDynamicRangeList()` |
| Trickplay type | `trickplayType()`, `trickplayTypeList()` |
| Audio / subtitle language | `text()`, `textList()` |
| Advanced patterns | `custom()` |

The following example creates an HD streaming endpoint that serves only H.264/H.265 content between 1–5 Mbps with stereo audio in English or French:

```ts
declare const channel: Channel;

new OriginEndpoint(this, 'Endpoint', {
  channel,
  segment: Segment.cmaf(),
  manifests: [
    Manifest.hls({
      manifestName: 'index',
      filterConfiguration: {
        manifestFilter: [
          ManifestFilter.bitrateRange(BitrateFilterKey.VIDEO_BITRATE, Bitrate.mbps(1), Bitrate.mbps(5)),
          ManifestFilter.numericRange(NumericFilterKey.VIDEO_HEIGHT, 720, 1080),
          ManifestFilter.videoCodecList([VideoCodec.H264, VideoCodec.H265]),
          ManifestFilter.numeric(NumericFilterKey.AUDIO_CHANNELS, 2),
          ManifestFilter.textList(TextFilterKey.AUDIO_LANGUAGE, ['en-US', 'fr']),
        ],
        timeDelay: Duration.seconds(30),
      },
    }),
  ],
});
```

For advanced patterns that combine ranges and single values, use `numericCombo()` or `bitrateCombo()`:

```ts
declare const channel: Channel;

new OriginEndpoint(this, 'Endpoint', {
  channel,
  segment: Segment.cmaf(),
  manifests: [
    Manifest.hls({
      manifestName: 'index',
      filterConfiguration: {
        manifestFilter: [
          // video_height:240-360,720-1080,1440
          ManifestFilter.numericCombo(NumericFilterKey.VIDEO_HEIGHT, [
            NumericExpression.range(240, 360),
            NumericExpression.range(720, 1080),
            NumericExpression.value(1440),
          ]),
        ],
      },
    }),
  ],
});
```

### DRM Settings

You can exclude session keys from HLS and LL-HLS multivariant playlists using the `drmSettings` filter configuration. This improves compatibility with legacy HLS clients and provides more granular access control:

```ts
declare const channel: Channel;

new OriginEndpoint(this, 'Endpoint', {
  channel,
  segment: Segment.cmaf(),
  manifests: [
    Manifest.hls({
      manifestName: 'index',
      filterConfiguration: {
        drmSettings: [DrmSettingsKey.EXCLUDE_SESSION_KEYS],
      },
    }),
  ],
});
```

## Start Tag Configuration

Configure where playback should start in HLS and LL-HLS manifests using the EXT-X-START tag:

```ts
declare const channel: Channel;

new OriginEndpoint(this, 'Endpoint', {
  channel,
  segment: Segment.cmaf(),
  manifests: [
    Manifest.hls({
      manifestName: 'index',
      startTag: StartTag.of(10),
    }),
  ],
});
```

## Segment Configuration

Configure segment settings for your origin endpoint.

```ts
declare const channel: Channel;

new OriginEndpoint(this, 'TsEndpoint', {
  channel,
  segment: Segment.ts({
    duration: Duration.seconds(6),
    name: 'segment',
    includeDvbSubtitles: true,
    useAudioRenditionGroup: true,
    includeIframeOnlyStreams: false,
    scteFilter: [
      ScteMessageType.BREAK,
      ScteMessageType.DISTRIBUTOR_ADVERTISEMENT,
    ],
  }),
  manifests: [Manifest.hls({ manifestName: 'index' })],
});

new OriginEndpoint(this, 'CmafEndpoint', {
  channel,
  segment: Segment.cmaf({
    duration: Duration.seconds(6),
    name: 'segment',
    includeIframeOnlyStreams: true,
    scteFilter: [ScteMessageType.DISTRIBUTOR_ADVERTISEMENT],
  }),
  manifests: [Manifest.hls({ manifestName: 'index' })],
});

new OriginEndpoint(this, 'Endpoint', {
  channel,
  segment: Segment.cmaf(),
  manifests: [Manifest.hls({ manifestName: 'index' })],
});
```

## Encryption and DRM

Protect your content with encryption using SPEKE (Secure Packager and Encoder Key Exchange). Each container type has its own encryption class with type-safe options:

### CMAF Encryption

```ts
declare const channel: Channel;
declare const spekeRole: iam.IRole;

new OriginEndpoint(this, 'Endpoint', {
  channel,
  segment: Segment.cmaf({
    encryption: CmafEncryption.speke({
      method: CmafEncryptionMethod.CBCS,
      drmSystems: [CmafDrmSystem.FAIRPLAY, CmafDrmSystem.WIDEVINE],
      resourceId: 'my-content-id',
      url: 'https://example.com/speke',
      role: spekeRole,
      keyRotationInterval: Duration.seconds(300),
      audioPreset: PresetSpeke20Audio.PRESET_AUDIO_2,
      videoPreset: PresetSpeke20Video.PRESET_VIDEO_2,
    }),
  }),
  manifests: [Manifest.hls({ manifestName: 'index' })],
});
```

### TS Encryption

```ts
declare const channel: Channel;
declare const spekeRole: iam.IRole;

new OriginEndpoint(this, 'TsEndpoint', {
  channel,
  segment: Segment.ts({
    encryption: TsEncryption.speke({
      method: TsEncryptionMethod.SAMPLE_AES,
      resourceId: 'my-content-id',
      url: 'https://example.com/speke',
      role: spekeRole,
    }),
  }),
  manifests: [Manifest.hls({ manifestName: 'index' })],
});
```

TS encryption defaults the DRM system based on the method: FairPlay for `SAMPLE_AES`, Clear Key AES 128 for `AES_128`. You can override this with the `drmSystems` property using `TsDrmSystem`.

### Content Key Encryption

You can add content key encryption by providing a certificate imported into AWS Certificate Manager. Your DRM key provider must support content key encryption for this to work:

```ts
declare const channel: Channel;
declare const spekeRole: iam.IRole;
declare const certificate: certificatemanager.ICertificate;

new OriginEndpoint(this, 'Endpoint', {
  channel,
  segment: Segment.cmaf({
    encryption: CmafEncryption.speke({
      method: CmafEncryptionMethod.CBCS,
      drmSystems: [CmafDrmSystem.FAIRPLAY],
      resourceId: 'my-content-id',
      url: 'https://example.com/speke',
      role: spekeRole,
      certificate,
    }),
  }),
  manifests: [Manifest.hls({ manifestName: 'index' })],
});
```

### Excluding Segment DRM Metadata

For CMAF content, you can exclude DRM metadata from segments:

```ts
declare const channel: Channel;
declare const spekeRole: iam.IRole;

new OriginEndpoint(this, 'Endpoint', {
  channel,
  segment: Segment.cmaf({
    encryption: CmafEncryption.speke({
      method: CmafEncryptionMethod.CBCS,
      drmSystems: [CmafDrmSystem.FAIRPLAY],
      resourceId: 'my-content-id',
      url: 'https://example.com/speke',
      role: spekeRole,
      excludeSegmentDrmMetadata: true,
    }),
  }),
  manifests: [Manifest.hls({ manifestName: 'index' })],
});
```

### ISM (Smooth Streaming) Encryption

ISM endpoints use CENC encryption with PlayReady. Audio and video presets are always `SHARED`, and key rotation is not supported. The DRM system defaults to PlayReady:

```ts
declare const channel: Channel;
declare const spekeRole: iam.IRole;

new OriginEndpoint(this, 'IsmEndpoint', {
  channel,
  segment: Segment.ism({
    encryption: IsmEncryption.speke({
      resourceId: 'my-content-id',
      url: 'https://example.com/speke',
      role: spekeRole,
    }),
  }),
  manifests: [Manifest.mss({ manifestName: 'index' })],
});
```

## CloudWatch Metrics

MediaPackage V2 resources expose CloudWatch metrics for monitoring. You can create alarms and dashboards using these metrics:

```ts
declare const channelGroup: ChannelGroup;
declare const channel: Channel;
declare const endpoint: OriginEndpoint;

// Create a CloudWatch alarm on channel group egress bytes
const alarm = channelGroup.metricEgressBytes().createAlarm(this, 'HighEgress', {
  threshold: 1000,
  evaluationPeriods: 1,
});

// Monitor channel ingress response time
channel.metricIngressResponseTime().createAlarm(this, 'SlowIngress', {
  threshold: 1000,
  evaluationPeriods: 2,
});

// Track origin endpoint request count
const requestMetric = endpoint.metricEgressRequestCount({
  statistic: 'sum',
  period: Duration.minutes(5),
});
```

Available metrics include:

- `metricIngressBytes()` - Bytes ingested
- `metricEgressBytes()` - Bytes delivered
- `metricIngressResponseTime()` - Ingress response time (average)
- `metricEgressResponseTime()` - Egress response time (average)
- `metricIngressRequestCount()` - Number of ingress requests
- `metricEgressRequestCount()` - Number of egress requests

All metrics support standard CloudWatch metric options for customizing period, statistic, and dimensions.
