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
your game server files. This section provides guidance on preparing and uploading custom game server build
files or Realtime Servers server script files. When you upload files, you create a GameLift build or script resource, which
you then deploy on fleets of hosting resources.

To troubleshoot fleet activation problems related to the server script, see [Debug GameLift fleet issues](https://docs.aws.amazon.com/gamelift/latest/developerguide/fleets-creating-debug.html).

#### Upload a custom server build to GameLift

Before uploading your configured game server to GameLift for hosting, package the game build files into a build directory.
This directory must include all components required to run your game servers and host game sessions, including the following:

* Game server binaries – The binary files required to run the game server. A build can include binaries for multiple game
servers built to run on the same platform. For a list of supported platforms, see [Download Amazon GameLift SDKs](https://docs.aws.amazon.com/gamelift/latest/developerguide/gamelift-supported.html).

* Dependencies – Any dependent files that your game server executables require to run. Examples include assets, configuration
files, and dependent libraries.

* Install script – A script file to handle tasks that are required to fully install your game build on GameLift hosting
servers. Place this file at the root of the build directory. GameLift runs the install script as part of fleet creation.

You can set up any application in your build, including your install script, to access your resources securely on other AWS
services.

```ts
declare const bucket: s3.Bucket;
new gamelift.Build(this, 'Build', {
  content: gamelift.Content.fromBucket(bucket, "sample-asset-key")
});
```

#### Upload a realtime server Script

Your server script can include one or more files combined into a single .zip file for uploading. The .zip file must contain
all files that your script needs to run.

You can store your zipped script files in either a local file directory or in an Amazon Simple Storage Service (Amazon S3)
bucket or defines a directory asset which is archived as a .zip file and uploaded to S3 during deployment.

After you create the script resource, GameLift deploys the script with a new Realtime Servers fleet. GameLift installs your
server script onto each instance in the fleet, placing the script files in `/local/game`.

```ts
declare const bucket: s3.Bucket;
new gamelift.Script(this, 'Script', {
  content: gamelift.Content.fromBucket(bucket, "sample-asset-key")
});
```

## GameLift FleetIQ

The GameLift FleetIQ solution is a game hosting layer that supplements the full
set of computing resource management tools that you get with Amazon EC2 and
Auto Scaling. This solution lets you directly manage your Amazon EC2 and Auto
Scaling resources and integrate as needed with other AWS services.

### Defining a Game Server Group

When using GameLift FleetIQ, you prepare to launch Amazon EC2 instances as
usual: make an Amazon Machine Image (AMI) with your game server software,
create an Amazon EC2 launch template, and define configuration settings for an
Auto Scaling group. However, instead of creating an Auto Scaling group
directly, you create a GameLift FleetIQ game server group with your Amazon EC2
and Auto Scaling resources and configuration. All game server groups must have
at least two instance types defined for it.

Once a game server group and Auto Scaling group are up and running with
instances deployed, when updating a Game Server Group instance, only certain
properties in the Auto Scaling group may be overwrite. For all other Auto
Scaling group properties, such as MinSize, MaxSize, and LaunchTemplate, you can
modify these directly on the Auto Scaling group using the AWS Console or
dedicated Api.

```ts
declare const launchTemplate: ec2.ILaunchTemplate;
declare const vpc: ec2.IVpc;

new gamelift.GameServerGroup(this, 'Game server group', {
  gameServerGroupName: 'sample-gameservergroup-name',
  instanceDefinitions: [{
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
  },
  {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
  }],
  launchTemplate: launchTemplate,
  vpc: vpc
});
```

See [Manage game server groups](https://docs.aws.amazon.com/gamelift/latest/fleetiqguide/gsg-integrate-gameservergroup.html)
in the *Amazon GameLift FleetIQ Developer Guide*.

### Scaling Policy

The scaling policy uses the metric `PercentUtilizedGameServers` to maintain a
buffer of idle game servers that can immediately accommodate new games and
players.

```ts
declare const launchTemplate: ec2.ILaunchTemplate;
declare const vpc: ec2.IVpc;

new gamelift.GameServerGroup(this, 'Game server group', {
  gameServerGroupName: 'sample-gameservergroup-name',
  instanceDefinitions: [{
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
  },
  {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
  }],
  launchTemplate: launchTemplate,
  vpc: vpc,
  autoScalingPolicy: {
    estimatedInstanceWarmup: Duration.minutes(5),
    targetTrackingConfiguration: 5
  }
});
```

See [Manage game server groups](https://docs.aws.amazon.com/gamelift/latest/fleetiqguide/gsg-integrate-gameservergroup.html)
in the *Amazon GameLift FleetIQ Developer Guide*.

### Specifying an IAM role

The GameLift FleetIQ class automatically creates an IAM role with all the minimum necessary
permissions for GameLift to access your Amazon EC2 Auto Scaling groups. If you wish, you may
specify your own IAM role. It must have the correct permissions, or FleetIQ creation or ressource usage may fail.

```ts
declare const launchTemplate: ec2.ILaunchTemplate;
declare const vpc: ec2.IVpc;

const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('gamelift.amazonaws.com'),
  new iam.ServicePrincipal('autoscaling.amazonaws.com'))
});
role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('GameLiftGameServerGroupPolicy'));

new gamelift.GameServerGroup(this, 'Game server group', {
  gameServerGroupName: 'sample-gameservergroup-name',
  instanceDefinitions: [{
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
  },
  {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
  }],
  launchTemplate: launchTemplate,
  vpc: vpc,
  role: role
});
```

See [Controlling Access](https://docs.aws.amazon.com/gamelift/latest/fleetiqguide/gsg-iam-permissions-roles.html)
in the *Amazon GameLift FleetIQ Developer Guide*.

### Specifying VPC Subnets

GameLift FleetIQ use by default, all supported GameLift FleetIQ Availability
Zones in your chosen region. You can override this parameter to specify VPCs
subnets that you've set up.

This property cannot be updated after the game server group is created, and the
corresponding Auto Scaling group will always use the property value that is set
with this request, even if the Auto Scaling group is updated directly.

```ts
declare const launchTemplate: ec2.ILaunchTemplate;
declare const vpc: ec2.IVpc;

new gamelift.GameServerGroup(this, 'GameServerGroup', {
  gameServerGroupName: 'sample-gameservergroup-name',
  instanceDefinitions: [{
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
  },
  {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
  }],
  launchTemplate: launchTemplate,
  vpc: vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
});
```

### Monitoring

GameLift FleetIQ sends metrics to CloudWatch so that you can collect and
analyze the activity of your Game server fleet, including the number of
utilized game servers, and the number of game server interruption due to
limited Spot availability.

You can then use CloudWatch alarms to alert you, for example, when the portion
of game servers that are currently supporting game executions exceed a certain
thresold which could means that your autoscaling policy need to be adjust to
add more instances to match with player demand.

CDK provides a generic `metric` method that can be used
to produce metric configurations for any metric provided by GameLift FleetIQ;
the configurations are pre-populated with the correct dimensions for the
matchmaking configuration.

```ts
declare const gameServerGroup: gamelift.IGameServerGroup;
// Alarm that triggers when the percent of utilized game servers exceed 90%
new cloudwatch.Alarm(this, 'Alarm', {
  metric: gameServerGroup.metric('UtilizedGameServers'),
  threshold: 0.9,
  evaluationPeriods: 2,
});
```

See: [Monitoring with CloudWatch](https://docs.aws.amazon.com/gamelift/latest/fleetiqguide/gsg-metrics.html)
in the *Amazon GameLift FleetIQ Developer Guide*.
