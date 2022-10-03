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

### Uploading builds and scripts to GameLift

Before deploying your GameLift-enabled multiplayer game servers for hosting with the GameLift service, you need to upload
your game server files. This section provide guidance on preparing and uploading custom game server build
files or Realtime Servers server script files. When you upload files, you create a GameLift build or script resource, which
you then deploy on fleets of hosting resources.

### Upload a custom server build to GameLift

Before uploading your configured game server to GameLift for hosting, package the game build files into a build directory.
This directory must include all components required to run your game servers and host game sessions, including the following:

* Game server binaries – The binary files required to run the game server. A build can include binaries for multiple game
servers built to run on the same platform. For a list of supported platforms, see Download Amazon GameLift SDKs.

* Dependencies – Any dependent files that your game server executables require to run. Examples include assets, configuration
files, and dependent libraries.

* Install script – A script file to handle tasks that are required to fully install your game build on GameLift hosting
servers. Place this file at the root of the build directory. GameLift runs the install script as part of fleet creation.

You can set up any application in your build, including your install script, to access your resources securely on other AWS
services.

```ts
import * as gamelift from 'aws-cdk-lib/aws-gamelift';

// Build can be declared using either declarative version in the constructor
const build = new gamelift.Build(this, 'Build', {
  content: new gamelift.Content.fromAsset(path.join(__dirname, "sample-asset-directory"))
});

// Either using dedicated factory static method
const build = gamelift.Build.fromBuildAsset(path.join(__dirname, 'CustomerGameServer/');
```
