## AWS::IVS Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

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

### Channels

An Amazon IVS channel stores configuration information related to your live
stream. You first create a channel and then contribute video to it using the
channel’s stream key to start your live stream.

You can create a channel

```ts
let myChannel = new ivs.Channel(this, 'Channel');
```

You can reference an existing channel, for example, if you need to create a
stream key for an existing channel

```ts
let myChannel = ivs.Channel.fromChannelArn(this, 'Channel', myChannelArn)
```

You can create stream keys

```ts
new ivs.StreamKey(this, 'StreamKey', {
  channel: myChannel,
});
```

### Private Streams

Amazon Interactive Video Service (IVS) offers customers the ability to create
private channels, allowing customers to restrict their streams by channel or
viewer. Customers control access to video playback by enabling playback
authorization on channels and generating signed JSON Web Tokens (JWTs) for
authorized playback requests.

A playback token is a JWT that the Amazon IVS customer signs (with a playback
authorization key) and includes with every playback request for a channel that
has playback authorization enabled.

In order for Amazon IVS to validate the token, the customer needs to upload
the public key that corresponds to the private key they used to sign the token.

```ts
new ivs.PlaybackKeyPair(this, 'PlaybackKeyPair', {
  publicKeyMaterial: myPublicKeyPemString,
});
```
