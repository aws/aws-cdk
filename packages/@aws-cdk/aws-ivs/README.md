## AWS::IVS Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

---
<!--END STABILITY BANNER-->

Amazon Interactive Video Service (Amazon IVS) is a managed live streaming solution that is quick and easy to set up, and ideal for creating interactive video experiences. Send your live streams to Amazon IVS using streaming software and the service does everything you need to make low-latency live video available to any viewer around the world, letting you focus on building interactive experiences alongside the live video. You can easily customize and enhance the audience experience through the Amazon IVS player SDK and timed metadata APIs, allowing you to build a more valuable relationship with your viewers on your own websites and applications.

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

### Installation

Import to your project:

```ts
import ivs = require('@aws-cdk/aws-ivs');
```

### Basic usage

You can create a channel

```ts
new ivs.Channel(this, 'Channel');
```

You can specify the properties you need

```ts
new ivs.Channel(this, 'Channel', {
  authorized: true,
  name: 'Carrots',
});
```

You can create stream keys

```ts
new ivs.StreamKey(this, 'StreamKey', {
  channel: ivs.Channel.fromChannelArn(this, 'ChannelRef', myChannelArn),
});
```

You can create playback key pairs

```ts
new ivs.PlaybackKeyPair(this, 'PlaybackKeyPair', {
  publicKeyMaterial: myPublicKeyPemString,
});
```
