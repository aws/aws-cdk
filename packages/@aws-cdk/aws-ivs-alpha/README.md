# AWS::IVS Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

Amazon Interactive Video Service (Amazon IVS) is a managed live streaming
solution that is quick and easy to set up, and ideal for creating interactive
video experiences. Send your live streams to Amazon IVS using streaming software
and the service does everything you need to make low-latency live video
available to any viewer around the world, letting you focus on building
interactive experiences alongside the live video. You can easily customize and
enhance the audience experience through the Amazon IVS player SDK and timed
metadata APIs, allowing you to build a more valuable relationship with your
viewers on your own websites and applications.

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Channels

An Amazon IVS channel stores configuration information related to your live
stream. You first create a channel and then contribute video to it using the
channel’s stream key to start your live stream.

You can create a channel

```ts
const myChannel = new ivs.Channel(this, 'Channel');
```

You can use Advanced Channel type by setting the `type` property to
`ivs.ChannelType.ADVANCED_HD` or `ivs.ChannelType.ADVANCED_SD`.

Additionally, when using the Advanced Channel type, you can set
the `preset` property to `ivs.Preset.CONSTRAINED_BANDWIDTH_DELIVERY`
or `ivs.Preset.HIGHER_BANDWIDTH_DELIVERY`.

For more information, see [Amazon IVS Streaming Configuration](https://docs.aws.amazon.com/ivs/latest/LowLatencyUserGuide/streaming-config.html).

```ts
const myChannel = new ivs.Channel(this, 'myChannel', {
  type: ivs.ChannelType.ADVANCED_HD,
  preset: ivs.Preset.CONSTRAINED_BANDWIDTH_DELIVERY,
});
```

If you want to use RTMP ingest, set `insecureIngest` property to `true`.
By default, `insecureIngest` is `false` which means using RTMPS ingest.

**⚠ Note:** RTMP ingest might result in reduced security for your streams. AWS recommends that you use RTMPS for ingest, unless you have specific and verified use cases. For more information, see [Encoder Settings](https://docs.aws.amazon.com/ivs/latest/LowLatencyUserGuide/streaming-config.html#streaming-config-settings).

```ts
const myRtmpChannel = new ivs.Channel(this, 'myRtmpChannel', {
  type: ivs.ChannelType.STANDARD,
  insecureIngest: true, // default value is false
});
```

### Importing an existing channel

You can reference an existing channel, for example, if you need to create a
stream key for an existing channel

```ts
const myChannel = ivs.Channel.fromChannelArn(this, 'Channel', myChannelArn);
```

## Stream Keys

A Stream Key is used by a broadcast encoder to initiate a stream and identify
to Amazon IVS which customer and channel the stream is for. If you are
storing this value, it should be treated as if it were a password.

You can create a stream key for a given channel

```ts fixture=with-channel
const myStreamKey = myChannel.addStreamKey('StreamKey');
```

## Private Channels

Amazon IVS offers the ability to create private channels, allowing
you to restrict your streams by channel or viewer. You control access
to video playback by enabling playback authorization on channels and
generating signed JSON Web Tokens (JWTs) for authorized playback requests.

A playback token is a JWT that you sign (with a playback authorization key)
and include with every playback request for a channel that has playback
authorization enabled.

In order for Amazon IVS to validate the token, you need to upload
the public key that corresponds to the private key you use to sign the token.

```ts
const keyPair = new ivs.PlaybackKeyPair(this, 'PlaybackKeyPair', {
  publicKeyMaterial: myPublicKeyPemString,
});
```

Then, when creating a channel, specify the authorized property

```ts
const myChannel = new ivs.Channel(this, 'Channel', {
  authorized: true, // default value is false
});
```
