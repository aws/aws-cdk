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
  content: gamelift.Content.fromBucket(bucket, "sample-asset-key"),
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
  content: gamelift.Content.fromBucket(bucket, "sample-asset-key"),
});
```

### Defining a GameLift Fleet

#### Creating a custom game server fleet

Your uploaded game servers are hosted on GameLift virtual computing resources,
called instances. You set up your hosting resources by creating a fleet of
instances and deploying them to run your game servers. You can design a fleet
to fit your game's needs.

```ts
new gamelift.BuildFleet(this, 'Game server fleet', {
  content: gamelift.Build.fromAsset(this, 'Build', path.join(__dirname, 'CustomerGameServer')),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
  runtimeConfiguration: {
    serverProcesses: [{
      launchPath: 'test-launch-path',
    }],
  },
});
```

### Managing game servers launch configuration

GameLift uses a fleet's runtime configuration to determine the type and number
of processes to run on each instance in the fleet. At a minimum, a runtime
configuration contains one server process configuration that represents one
game server executable. You can also define additional server process
configurations to run other types of processes related to your game. Each
server process configuration contains the following information:

* The file name and path of an executable in your game build.

* Optionally Parameters to pass to the process on launch.

* The number of processes to run concurrently.

A GameLift instance is limited to 50 processes running concurrently.

```ts
declare const build: gamelift.Build;
// Server processes can be delcared in a declarative way through the constructor
const fleet = new gamelift.BuildFleet(this, 'Game server fleet', {
  content: build,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
  runtimeConfiguration: {
    serverProcesses: [{
      launchPath: '/local/game/GameLiftExampleServer.x86_64',
      parameters: '-logFile /local/game/logs/myserver1935.log -port 1935',
      concurrentExecutions: 100,
    }]
  }
});
```

See [Managing how game servers are launched for hosting](https://docs.aws.amazon.com/gamelift/latest/developerguide/fleets-multiprocess.html)
in the *Amazon GameLift Developer Guide*.

### Defining an instance type

GameLift uses Amazon Elastic Compute Cloud (Amazon EC2) resources, called
instances, to deploy your game servers and host game sessions for your players.
When setting up a new fleet, you decide what type of instances your game needs
and how to run game server processes on them (using a runtime configuration). All instances in a fleet use the same type of resources and the same runtime
configuration. You can edit a fleet's runtime configuration and other fleet
properties, but the type of resources cannot be changed.

```ts
declare const build: gamelift.Build;
new gamelift.BuildFleet(this, 'Game server fleet', {
  content: build,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
  runtimeConfiguration: {
    serverProcesses: [{
      launchPath: '/local/game/GameLiftExampleServer.x86_64',
    }]
  }
});
```

### Using Spot instances

When setting up your hosting resources, you have the option of using Spot
Instances, On-Demand Instances, or a combination.

By default, fleet are using on demand capacity.

```ts
declare const build: gamelift.Build;
new gamelift.BuildFleet(this, 'Game server fleet', {
  content: build,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
  runtimeConfiguration: {
    serverProcesses: [{
      launchPath: '/local/game/GameLiftExampleServer.x86_64',
    }]
  },
  useSpot: true
});
```

### Allowing Ingress traffic

The allowed IP address ranges and port settings that allow inbound traffic to
access game sessions on this fleet.

New game sessions are assigned an IP address/port number combination, which
must fall into the fleet's allowed ranges. Fleets with custom game builds must
have permissions explicitly set. For Realtime Servers fleets, GameLift
automatically opens two port ranges, one for TCP messaging and one for UDP.

```ts
declare const build: gamelift.Build;

const fleet = new gamelift.BuildFleet(this, 'Game server fleet', {
  content: build,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
  runtimeConfiguration: {
    serverProcesses: [{
      launchPath: '/local/game/GameLiftExampleServer.x86_64',
    }]
  },
  ingressRules: [{
    source: gamelift.Peer.anyIpv4(),
    port: gamelift.Port.tcpRange(100, 200),
  }]
});
// Allowing all IP Addresses from port 1111 to port 1122 on TCP Protocol
fleet.addIngressRule(gamelift.Peer.anyIpv4(), gamelift.Port.tcpRange(100, 200));

// Allowing a specific CIDR for port 1111 on UDP Protocol
fleet.addIngressRule(gamelift.Peer.ipv4('1.2.3.4/32'), gamelift.Port.udp(1111));
```

### Managing locations

A single Amazon GameLift fleet has a home Region by default (the Region you
deploy it to), but it can deploy resources to any number of GameLift supported
Regions. Select Regions based on where your players are located and your
latency needs.

By default, home region is used as default location but we can add new locations if needed and define desired capacity

```ts
declare const build: gamelift.Build;

// Locations can be added directly through constructor
const fleet = new gamelift.BuildFleet(this, 'Game server fleet', {
  content: build,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
  runtimeConfiguration: {
    serverProcesses: [{
      launchPath: '/local/game/GameLiftExampleServer.x86_64',
    }]
  },
  locations: [ {
    region: 'eu-west-1',
    capacity: {
      desiredCapacity: 5,
      minSize: 2,
      maxSize: 10
    }
  }, {
    region: 'us-east-1',
    capacity: {
      desiredCapacity: 5,
      minSize: 2,
      maxSize: 10
    }
  }]
});

// Or through dedicated methods
fleet.addLocation('ap-southeast-1', 5, 2, 10);
```

### Specifying an IAM role

Some GameLift features require you to extend limited access to your AWS
resources. This is done by creating an AWS IAM role. The GameLift Fleet class
automatically created an IAM role with all the minimum necessary permissions
for GameLift to access your ressources. If you wish, you may
specify your own IAM role.

```ts
declare const build: gamelift.Build;
const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('gamelift.amazonaws.com'))
});
role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy'));

const fleet = new gamelift.BuildFleet(this, 'Game server fleet', {
  content: build,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
  runtimeConfiguration: {
    serverProcesses: [{
      launchPath: '/local/game/GameLiftExampleServer.x86_64',
    }]
  },
  role: role
});

// Actions can also be grantted through dedicated method
fleet.grant(role, 'gamelift:ListFleets');
```

### Monitoring

GameLift is integrated with CloudWatch, so you can monitor the performance of
your game servers via logs and metrics.

#### Metrics

GameLift Fleet sends metrics to CloudWatch so that you can collect and analyze
the activity of your Fleet, including game  and player sessions and server
processes.

You can then use CloudWatch alarms to alert you, for example, when matches has
been rejected (potential matches that were rejected by at least one player
since the last report) exceed a certain thresold which could means that you may
have an issue in your matchmaking rules.

CDK provides methods for accessing GameLift Fleet metrics with default configuration,
such as `metricActiveInstances`, or `metricIdleInstances` (see [`IFleet`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-gamelift.IFleet.html)
for a full list). CDK also provides a generic `metric` method that can be used
to produce metric configurations for any metric provided by GameLift Fleet,
Game sessions or server processes; the configurations are pre-populated with
the correct dimensions for the matchmaking configuration.

```ts
declare const fleet: gamelift.BuildFleet;
// Alarm that triggers when the per-second average of not used instances exceed 10%
const instancesUsedRatio = new cloudwatch.MathExpression({
  expression: '1 - (activeInstances / idleInstances)',
  usingMetrics: {
    activeInstances: fleet.metric('ActiveInstances', { statistic: cloudwatch.Statistic.SUM }),
    idleInstances: fleet.metricIdleInstances(),
  },
});
new cloudwatch.Alarm(this, 'Alarm', {
  metric: instancesUsedRatio,
  threshold: 0.1,
  evaluationPeriods: 3,
});
```

See: [Monitoring Using CloudWatch Metrics](https://docs.aws.amazon.com/gamelift/latest/developerguide/monitoring-cloudwatch.html)
in the *Amazon GameLift Developer Guide*.
