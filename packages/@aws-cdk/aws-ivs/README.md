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
const myChannel = new ivs.Channel(this, 'Channel');
```

#### Importing an existing channel
You can reference an existing channel, for example, if you need to create a
stream key for an existing channel

```ts
const myChannelArn = 'arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh';
const myChannel = ivs.Channel.fromChannelArn(this, 'Channel', myChannelArn);
```

#### Stream Keys

You can create a stream key for a given channel

```ts
const myStreamKey = myChannel.addStreamKey('StreamKey');
```

#### Private Channels

Amazon IVS offers customers the ability to create private channels, allowing
customers to restrict their streams by channel or viewer. Customers control
access to video playback by enabling playback authorization on channels and
generating signed JSON Web Tokens (JWTs) for authorized playback requests.

A playback token is a JWT that the Amazon IVS customer signs (with a playback
authorization key) and includes with every playback request for a channel that
has playback authorization enabled.

In order for Amazon IVS to validate the token, the customer needs to upload
the public key that corresponds to the private key they used to sign the token.

```ts
const keyPair = new ivs.PlaybackKeyPair(this, 'PlaybackKeyPair', {
  publicKeyMaterial: myPublicKeyPemString,
});
```

Then, when creating a channel, specify the authorized property
```ts
const myChannel = new ivs.Channel(this, 'Channel', {
  authorized: true,
});
```


