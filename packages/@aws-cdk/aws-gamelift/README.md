# Amazon GameLift Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

[Amazon GameLift](https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-intro.html) is a service used
to deploy, operate, and scale dedicated, low-cost servers in the cloud for session-based multiplayer games. Built
on AWS global computing infrastructure, GameLift helps deliver high-performance, high-reliability game servers
while dynamically scaling your resource usage to meet worldwide player demand.

GameLift is composed of three main components:

* GameLift FlexMatch which is a customizable matchmaking service for
multiplayer games. With FlexMatch, you can
build a custom set of rules that defines what a multiplayer match looks like
for your game, and determines how to
evaluate and select compatible players for each match. You can also customize
key aspects of the matchmaking
process to fit your game, including fine-tuning the matching algorithm.
  
* GameLift hosting for custom or realtime servers which helps you deploy,
operate, and scale dedicated game servers. It regulates the resources needed to
host games, finds available game servers to host new game sessions, and puts
players into games.
  
* GameLift FleetIQ to optimize the use of low-cost Amazon Elastic Compute Cloud
(Amazon EC2) Spot Instances for cloud-based game hosting. With GameLift
FleetIQ, you can work directly with your hosting resources in Amazon EC2 and
Amazon EC2 Auto Scaling while taking advantage of GameLift optimizations to
deliver inexpensive, resilient game hosting for your players

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project. It allows you to define components for your matchmaking
configuration or game server fleet management system.

## GameLift Hosting

### Defining a GameLift Fleet

GameLift helps you deploy, operate, and scale dedicated game servers for
session-based multiplayer games. It helps you regulate the resources needed to
host your games, finds available game servers to host new game sessions, and
puts players into games.

### Creating a custom server build

Your uploaded game servers are hosted on GameLift virtual computing resources,
called instances. You set up your hosting resources by creating a fleet of
instances and deploying them to run your game servers. You can design a fleet
to fit your game's needs.

```ts
import * as gamelift from 'aws-cdk-lib/aws-gamelift';

// Build can be declared using either declarative version in the constructor
const build = new gamelift.Build(this, 'Build', {
  content: new gamelift.Content.fromAsset(path.join(__dirname, "sample-asset-directory"))
});

// Either using dedicated factory static method
const build = gamelift.Build.fromBuildAsset(path.join(__dirname, 'CustomerGameServer/');
```
