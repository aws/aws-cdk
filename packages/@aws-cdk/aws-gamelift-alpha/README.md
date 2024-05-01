# Amazon GameLift Construct Library
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

## GameLift FlexMatch

### Defining a Matchmaking configuration

FlexMatch is available both as a GameLift game hosting solution (including
Realtime Servers) and as a standalone matchmaking service. To set up a
FlexMatch matchmaker to process matchmaking requests, you have to create a
matchmaking configuration based on a RuleSet.

More details about matchmaking ruleSet are covered [below](#matchmaking-ruleset).

There is two types of Matchmaking configuration:

Through a game session queue system to let FlexMatch forms matches and uses the specified GameLift queue to start a game session for the match.

```ts
declare const queue: gamelift.GameSessionQueue;
declare const ruleSet: gamelift.MatchmakingRuleSet;

new gamelift.QueuedMatchmakingConfiguration(this, 'QueuedMatchmakingConfiguration', {
  matchmakingConfigurationName: 'test-queued-config-name',
  gameSessionQueues: [queue],
  ruleSet: ruleSet,
});
```

Or through a standalone version to let FlexMatch forms matches and returns match information in an event.

```ts
declare const ruleSet: gamelift.MatchmakingRuleSet;

new gamelift.StandaloneMatchmakingConfiguration(this, 'StandaloneMatchmaking', {
  matchmakingConfigurationName: 'test-standalone-config-name',
  ruleSet: ruleSet,
});
```


More details about Game session queue are covered [below](#game-session-queue).

### Matchmaking RuleSet

Every FlexMatch matchmaker must have a rule set. The rule set determines the
two key elements of a match: your game's team structure and size, and how to
group players together for the best possible match.

For example, a rule set might describe a match like this: Create a match with
two teams of four to eight players each, one team is the cowboy and the other
team the aliens. A team can have novice and experienced players, but the
average skill of the two teams must be within 10 points of each other. If no
match is made after 30 seconds, gradually relax the skill requirements.

```ts
new gamelift.MatchmakingRuleSet(this, 'RuleSet', {
  matchmakingRuleSetName: 'my-test-ruleset',
  content: gamelift.RuleSetContent.fromJsonFile(path.join(__dirname, 'my-ruleset', 'ruleset.json')),
});
```

### FlexMatch Monitoring

You can monitor GameLift FlexMatch activity for matchmaking configurations and
matchmaking rules using Amazon CloudWatch. These statistics are used to provide
a historical perspective on how your Gamelift FlexMatch solution is performing.

#### FlexMatch Metrics

GameLift FlexMatch sends metrics to CloudWatch so that you can collect and
analyze the activity of your matchmaking solution, including match acceptance
workflow, ticket consumtion.

You can then use CloudWatch alarms to alert you, for example, when matches has
been rejected (potential matches that were rejected by at least one player
since the last report) exceed a certain thresold which could means that you may
have an issue in your matchmaking rules.

CDK provides methods for accessing GameLift FlexMatch metrics with default configuration,
such as `metricRuleEvaluationsPassed`, or `metricRuleEvaluationsFailed` (see
[`IMatchmakingRuleSet`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-gamelift.IMatchmakingRuleSet.html)
for a full list). CDK also provides a generic `metric` method that can be used
to produce metric configurations for any metric provided by GameLift FlexMatch;
the configurations are pre-populated with the correct dimensions for the
matchmaking configuration.

```ts
declare const matchmakingRuleSet: gamelift.MatchmakingRuleSet;
// Alarm that triggers when the per-second average of not placed matches exceed 10%
const ruleEvaluationRatio = new cloudwatch.MathExpression({
  expression: '1 - (ruleEvaluationsPassed / ruleEvaluationsFailed)',
  usingMetrics: {
    ruleEvaluationsPassed: matchmakingRuleSet.metricRuleEvaluationsPassed({ statistic: cloudwatch.Statistic.SUM }),
    ruleEvaluationsFailed: matchmakingRuleSet.metric('ruleEvaluationsFailed'),
  },
});
new cloudwatch.Alarm(this, 'Alarm', {
  metric: ruleEvaluationRatio,
  threshold: 0.1,
  evaluationPeriods: 3,
});
```

See: [Monitoring Using CloudWatch Metrics](https://docs.aws.amazon.com/gamelift/latest/developerguide/monitoring-cloudwatch.html)
in the *Amazon GameLift Developer Guide*.


## GameLift Hosting

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
const build = new gamelift.Build(this, 'Build', {
  content: gamelift.Content.fromBucket(bucket, "sample-asset-key")
});

new CfnOutput(this, 'BuildArn', { value: build.buildArn });
new CfnOutput(this, 'BuildId', { value: build.buildId });
```

To specify a server SDK version you used when integrating your game server build with Amazon GameLift use the `serverSdkVersion` parameter:

> See [Integrate games with custom game servers](https://docs.aws.amazon.com/gamelift/latest/developerguide/integration-custom-intro.html) for more details.

```ts
declare const bucket: s3.Bucket;
const build = new gamelift.Build(this, 'Build', {
  content: gamelift.Content.fromBucket(bucket, "sample-asset-key"),
  serverSdkVersion: '5.0.0',
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

### Defining a GameLift Fleet

#### Creating a custom game server fleet

Your uploaded game servers are hosted on GameLift virtual computing resources,
called instances. You set up your hosting resources by creating a fleet of
instances and deploying them to run your game servers. You can design a fleet
to fit your game's needs.

```ts
new gamelift.BuildFleet(this, 'Game server fleet', {
  fleetName: 'test-fleet',
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
  fleetName: 'test-fleet',
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
  fleetName: 'test-fleet',
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
  fleetName: 'test-fleet',
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
  fleetName: 'test-fleet',
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
  fleetName: 'test-fleet',
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

### Specifying an IAM role for a Fleet

Some GameLift features require you to extend limited access to your AWS
resources. This is done by creating an AWS IAM role. The GameLift Fleet class
automatically created an IAM role with all the minimum necessary permissions
for GameLift to access your resources. If you wish, you may
specify your own IAM role.

```ts
declare const build: gamelift.Build;
const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('gamelift.amazonaws.com'))
});
role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy'));

const fleet = new gamelift.BuildFleet(this, 'Game server fleet', {
  fleetName: 'test-fleet',
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

### Alias

A GameLift alias is used to abstract a fleet designation. Fleet designations
tell Amazon GameLift where to search for available resources when creating new
game sessions for players. By using aliases instead of specific fleet IDs, you
can more easily and seamlessly switch player traffic from one fleet to another
by changing the alias's target location.

```ts
declare const fleet: gamelift.BuildFleet;

// Add an alias to an existing fleet using a dedicated fleet method
const liveAlias = fleet.addAlias('live');

// You can also create a standalone alias
new gamelift.Alias(this, 'TerminalAlias', {
  aliasName: 'terminal-alias',
  terminalMessage: 'A terminal message',
});
```

See [Add an alias to a GameLift fleet](https://docs.aws.amazon.com/gamelift/latest/developerguide/aliases-creating.html)
in the *Amazon GameLift Developer Guide*.

### Monitoring your Fleet

GameLift is integrated with CloudWatch, so you can monitor the performance of
your game servers via logs and metrics.

#### Fleet Metrics

GameLift Fleet sends metrics to CloudWatch so that you can collect and analyze
the activity of your Fleet, including game  and player sessions and server
processes.

You can then use CloudWatch alarms to alert you, for example, when matches has
been rejected (potential matches that were rejected by at least one player
since the last report) exceed a certain threshold which could means that you may
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

## Game session queue

The game session queue is the primary mechanism for processing new game session
requests and locating available game servers to host them. Although it is
possible to request a new game session be hosted on specific fleet or location.

The `GameSessionQueue` resource creates a placement queue that processes requests for
new game sessions. A queue uses FleetIQ algorithms to determine the best placement
locations and find an available game server, then prompts the game server to start a
new game session. Queues can have destinations (GameLift fleets or aliases), which
determine where the queue can place new game sessions. A queue can have destinations
with varied fleet type (Spot and On-Demand), instance type, and AWS Region.

```ts
declare const fleet: gamelift.BuildFleet;
declare const alias: gamelift.Alias;

const queue = new gamelift.GameSessionQueue(this, 'GameSessionQueue', {
  gameSessionQueueName: 'my-queue-name',
  destinations: [fleet]
});
queue.addDestination(alias);
```

A more complex configuration can also be definied to override how FleetIQ algorithms prioritize game session placement in order to favour a destination based on `Cost`, `Latency`, `Destination order`or `Location`.

```ts
declare const fleet: gamelift.BuildFleet;
declare const topic: sns.Topic;

new gamelift.GameSessionQueue(this, 'MyGameSessionQueue', {
      gameSessionQueueName: 'test-gameSessionQueue',
      customEventData: 'test-event-data',
      allowedLocations: ['eu-west-1', 'eu-west-2'],
      destinations: [fleet],
      notificationTarget: topic,
      playerLatencyPolicies: [{
        maximumIndividualPlayerLatency: Duration.millis(100),
        policyDuration: Duration.seconds(300),
      }],
      priorityConfiguration: {
        locationOrder: [
          'eu-west-1',
          'eu-west-2',
        ],
        priorityOrder: [
          gamelift.PriorityType.LATENCY,
          gamelift.PriorityType.COST,
          gamelift.PriorityType.DESTINATION,
          gamelift.PriorityType.LOCATION,
        ],
      },
      timeout: Duration.seconds(300),
    });
```

See [Setting up GameLift queues for game session placement](https://docs.aws.amazon.com/gamelift/latest/developerguide/realtime-script-uploading.html)
in the *Amazon GameLift Developer Guide*.

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

### Specifying an IAM role for GameLift

The GameLift FleetIQ class automatically creates an IAM role with all the minimum necessary
permissions for GameLift to access your Amazon EC2 Auto Scaling groups. If you wish, you may
specify your own IAM role. It must have the correct permissions, or FleetIQ creation or resource usage may fail.

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

### FleetIQ Monitoring

GameLift FleetIQ sends metrics to CloudWatch so that you can collect and
analyze the activity of your Game server fleet, including the number of
utilized game servers, and the number of game server interruption due to
limited Spot availability.

You can then use CloudWatch alarms to alert you, for example, when the portion
of game servers that are currently supporting game executions exceed a certain
threshold which could means that your autoscaling policy need to be adjust to
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
