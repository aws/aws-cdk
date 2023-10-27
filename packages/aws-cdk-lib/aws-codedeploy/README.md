# AWS CodeDeploy Construct Library


## Table of Contents

- [Introduction](#introduction)
- Deploying to Amazon EC2 and on-premise instances
  - [EC2/on-premise Applications](#ec2on-premise-applications)
  - [EC2/on-premise Deployment Groups](#ec2on-premise-deployment-groups)
  - [EC2/on-premise Deployment Configurations](#ec2on-premise-deployment-configurations)
- Deploying to AWS Lambda functions
  - [Lambda Applications](#lambda-applications)
  - [Lambda Deployment Groups](#lambda-deployment-groups)
  - [Lambda Deployment Configurations](#lambda-deployment-configurations)
- Deploying to Amazon ECS services
  - [ECS Applications](#ecs-applications)
  - [ECS Deployment Groups](#ecs-deployment-groups)
  - [ECS Deployment Configurations](#ecs-deployment-configurations)
  - [ECS Deployments](#ecs-deployments)

## Introduction

AWS CodeDeploy is a deployment service that automates application deployments to
Amazon EC2 instances, on-premises instances, serverless Lambda functions, or
Amazon ECS services.

The CDK currently supports Amazon EC2, on-premise, AWS Lambda, and Amazon ECS applications.

## EC2/on-premise Applications

To create a new CodeDeploy Application that deploys to EC2/on-premise instances:

```ts
const application = new codedeploy.ServerApplication(this, 'CodeDeployApplication', {
  applicationName: 'MyApplication', // optional property
});
```

To import an already existing Application:

```ts
const application = codedeploy.ServerApplication.fromServerApplicationName(
  this,
  'ExistingCodeDeployApplication',
  'MyExistingApplication',
);
```

## EC2/on-premise Deployment Groups

To create a new CodeDeploy Deployment Group that deploys to EC2/on-premise instances:

```ts
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

declare const application: codedeploy.ServerApplication;
declare const asg: autoscaling.AutoScalingGroup;
declare const alarm: cloudwatch.Alarm;
const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'CodeDeployDeploymentGroup', {
  application,
  deploymentGroupName: 'MyDeploymentGroup',
  autoScalingGroups: [asg],
  // adds User Data that installs the CodeDeploy agent on your auto-scaling groups hosts
  // default: true
  installAgent: true,
  // adds EC2 instances matching tags
  ec2InstanceTags: new codedeploy.InstanceTagSet(
    {
      // any instance with tags satisfying
      // key1=v1 or key1=v2 or key2 (any value) or value v3 (any key)
      // will match this group
      'key1': ['v1', 'v2'],
      'key2': [],
      '': ['v3'],
    },
  ),
  // adds on-premise instances matching tags
  onPremiseInstanceTags: new codedeploy.InstanceTagSet(
    // only instances with tags (key1=v1 or key1=v2) AND key2=v3 will match this set
    {
      'key1': ['v1', 'v2'],
    },
    {
      'key2': ['v3'],
    },
  ),
  // CloudWatch alarms
  alarms: [alarm],
  // whether to ignore failure to fetch the status of alarms from CloudWatch
  // default: false
  ignorePollAlarmsFailure: false,
  // auto-rollback configuration
  autoRollback: {
    failedDeployment: true, // default: true
    stoppedDeployment: true, // default: false
    deploymentInAlarm: true, // default: true if you provided any alarms, false otherwise
  },
});
```

All properties are optional - if you don't provide an Application,
one will be automatically created.

To import an already existing Deployment Group:

```ts
declare const application: codedeploy.ServerApplication;
const deploymentGroup = codedeploy.ServerDeploymentGroup.fromServerDeploymentGroupAttributes(
  this,
  'ExistingCodeDeployDeploymentGroup', {
    application,
    deploymentGroupName: 'MyExistingDeploymentGroup',
  },
);
```

### Load balancers

You can [specify a load balancer](https://docs.aws.amazon.com/codedeploy/latest/userguide/integrations-aws-elastic-load-balancing.html)
with the `loadBalancer` property when creating a Deployment Group.

`LoadBalancer` is an abstract class with static factory methods that allow you to create instances of it from various sources.

With Classic Elastic Load Balancer, you provide it directly:

```ts
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancing';

declare const lb: elb.LoadBalancer;
lb.addListener({
  externalPort: 80,
});

const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'DeploymentGroup', {
  loadBalancer: codedeploy.LoadBalancer.classic(lb),
});
```

With Application Load Balancer or Network Load Balancer,
you provide a Target Group as the load balancer:

```ts
declare const alb: elbv2.ApplicationLoadBalancer;
const listener = alb.addListener('Listener', { port: 80 });
const targetGroup = listener.addTargets('Fleet', { port: 80 });

const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'DeploymentGroup', {
  loadBalancer: codedeploy.LoadBalancer.application(targetGroup),
});
```

The `loadBalancer` property has been deprecated. To provide multiple Elastic Load Balancers as target groups use the `loadBalancers` parameter:

```ts
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancing';
import * as elb2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

declare const clb: elb.LoadBalancer;
declare const alb: elb2.ApplicationLoadBalancer;
declare const nlb: elb2.NetworkLoadBalancer;

const albListener = alb.addListener('ALBListener', { port: 80 });
const albTargetGroup = albListener.addTargets('ALBFleet', { port: 80 });

const nlbListener = nlb.addListener('NLBListener', { port: 80 });
const nlbTargetGroup = nlbListener.addTargets('NLBFleet', { port: 80 });

const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'DeploymentGroup', {
  loadBalancers: [
    codedeploy.LoadBalancer.classic(clb),
    codedeploy.LoadBalancer.application(albTargetGroup),
    codedeploy.LoadBalancer.network(nlbTargetGroup),
  ]
});
```

## EC2/on-premise Deployment Configurations

You can also pass a Deployment Configuration when creating the Deployment Group:

```ts
const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'CodeDeployDeploymentGroup', {
  deploymentConfig: codedeploy.ServerDeploymentConfig.ALL_AT_ONCE,
});
```

The default Deployment Configuration is `ServerDeploymentConfig.ONE_AT_A_TIME`.

You can also create a custom Deployment Configuration:

```ts
const deploymentConfig = new codedeploy.ServerDeploymentConfig(this, 'DeploymentConfiguration', {
  deploymentConfigName: 'MyDeploymentConfiguration', // optional property
  // one of these is required, but both cannot be specified at the same time
  minimumHealthyHosts: codedeploy.MinimumHealthyHosts.count(2),
  // minimumHealthyHosts: codedeploy.MinimumHealthyHosts.percentage(75),
});
```

Or import an existing one:

```ts
const deploymentConfig = codedeploy.ServerDeploymentConfig.fromServerDeploymentConfigName(
  this,
  'ExistingDeploymentConfiguration',
  'MyExistingDeploymentConfiguration',
);
```

## Lambda Applications

To create a new CodeDeploy Application that deploys to a Lambda function:

```ts
const application = new codedeploy.LambdaApplication(this, 'CodeDeployApplication', {
  applicationName: 'MyApplication', // optional property
});
```

To import an already existing Application:

```ts
const application = codedeploy.LambdaApplication.fromLambdaApplicationName(
  this,
  'ExistingCodeDeployApplication',
  'MyExistingApplication',
);
```

## Lambda Deployment Groups

To enable traffic shifting deployments for Lambda functions, CodeDeploy uses Lambda Aliases, which can balance incoming traffic between two different versions of your function.
Before deployment, the alias sends 100% of invokes to the version used in production.
When you publish a new version of the function to your stack, CodeDeploy will send a small percentage of traffic to the new version, monitor, and validate before shifting 100% of traffic to the new version.

To create a new CodeDeploy Deployment Group that deploys to a Lambda function:

```ts
declare const myApplication: codedeploy.LambdaApplication;
declare const func: lambda.Function;
const version = func.currentVersion;
const version1Alias = new lambda.Alias(this, 'alias', {
  aliasName: 'prod',
  version,
});

const deploymentGroup = new codedeploy.LambdaDeploymentGroup(this, 'BlueGreenDeployment', {
  application: myApplication, // optional property: one will be created for you if not provided
  alias: version1Alias,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
});
```

In order to deploy a new version of this function:

1. Reference the version with the latest changes `const version = func.currentVersion`.
2. Re-deploy the stack (this will trigger a deployment).
3. Monitor the CodeDeploy deployment as traffic shifts between the versions.

### Lambda Deployment Rollbacks and Alarms

CodeDeploy will roll back if the deployment fails. You can optionally trigger a rollback when one or more alarms are in a failed state:

```ts
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

declare const alias: lambda.Alias;
const alarm = new cloudwatch.Alarm(this, 'Errors', {
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
  threshold: 1,
  evaluationPeriods: 1,
  metric: alias.metricErrors(),
});
const deploymentGroup = new codedeploy.LambdaDeploymentGroup(this, 'BlueGreenDeployment', {
  alias,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
  alarms: [
    // pass some alarms when constructing the deployment group
    alarm,
  ],
});

// or add alarms to an existing group
declare const blueGreenAlias: lambda.Alias;
deploymentGroup.addAlarm(new cloudwatch.Alarm(this, 'BlueGreenErrors', {
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
  threshold: 1,
  evaluationPeriods: 1,
  metric: blueGreenAlias.metricErrors(),
}));
```

### Pre and Post Hooks

CodeDeploy allows you to run an arbitrary Lambda function before traffic shifting actually starts (PreTraffic Hook) and after it completes (PostTraffic Hook).
With either hook, you have the opportunity to run logic that determines whether the deployment must succeed or fail.
For example, with PreTraffic hook you could run integration tests against the newly created Lambda version (but not serving traffic). With PostTraffic hook, you could run end-to-end validation checks.

```ts
declare const warmUpUserCache: lambda.Function;
declare const endToEndValidation: lambda.Function;
declare const alias: lambda.Alias;

// pass a hook whe creating the deployment group
const deploymentGroup = new codedeploy.LambdaDeploymentGroup(this, 'BlueGreenDeployment', {
  alias: alias,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
  preHook: warmUpUserCache,
});

// or configure one on an existing deployment group
deploymentGroup.addPostHook(endToEndValidation);
```

### Import an existing Lambda Deployment Group

To import an already existing Deployment Group:

```ts
declare const application: codedeploy.LambdaApplication;
const deploymentGroup = codedeploy.LambdaDeploymentGroup.fromLambdaDeploymentGroupAttributes(this, 'ExistingCodeDeployDeploymentGroup', {
  application,
  deploymentGroupName: 'MyExistingDeploymentGroup',
});
```

## Lambda Deployment Configurations

CodeDeploy for Lambda comes with predefined configurations for traffic shifting.
The predefined configurations are available as LambdaDeploymentConfig constants.

```ts
const config = codedeploy.LambdaDeploymentConfig.CANARY_10PERCENT_30MINUTES;

declare const application: codedeploy.LambdaApplication;
declare const alias: lambda.Alias;
const deploymentGroup = new codedeploy.LambdaDeploymentGroup(this, 'BlueGreenDeployment', {
  application,
  alias,
  deploymentConfig: config,
});
```

If you want to specify your own strategy,
you can do so with the LambdaDeploymentConfig construct,
letting you specify precisely how fast a new function version is deployed.

```ts
const config = new codedeploy.LambdaDeploymentConfig(this, 'CustomConfig', {
  trafficRouting: new codedeploy.TimeBasedCanaryTrafficRouting({
    interval: Duration.minutes(15),
    percentage: 5,
  }),
});

declare const application: codedeploy.LambdaApplication;
declare const alias: lambda.Alias;
const deploymentGroup = new codedeploy.LambdaDeploymentGroup(this, 'BlueGreenDeployment', {
  application,
  alias,
  deploymentConfig: config,
});
```

You can specify a custom name for your deployment config, but if you do you will not be able to update the interval/percentage through CDK.

```ts
const config = new codedeploy.LambdaDeploymentConfig(this, 'CustomConfig', {
  trafficRouting: new codedeploy.TimeBasedCanaryTrafficRouting({
    interval: Duration.minutes(15),
    percentage: 5,
  }),
  deploymentConfigName: 'MyDeploymentConfig',
});
```

To import an already existing Deployment Config:

```ts
const deploymentConfig = codedeploy.LambdaDeploymentConfig.fromLambdaDeploymentConfigName(
  this,
  'ExistingDeploymentConfiguration',
  'MyExistingDeploymentConfiguration',
);
```

## ECS Applications

To create a new CodeDeploy Application that deploys an ECS service:

```ts
const application = new codedeploy.EcsApplication(this, 'CodeDeployApplication', {
  applicationName: 'MyApplication', // optional property
});
```

To import an already existing Application:

```ts
const application = codedeploy.EcsApplication.fromEcsApplicationName(
  this,
  'ExistingCodeDeployApplication',
  'MyExistingApplication',
);
```

## ECS Deployment Groups

CodeDeploy can be used to deploy to load-balanced ECS services.
CodeDeploy performs ECS blue-green deployments by managing ECS task sets and load balancer
target groups.  During a blue-green deployment, one task set and target group runs the
original version of your ECS task definition ('blue') and another task set and target group
runs the new version of your ECS task definition ('green').

CodeDeploy orchestrates traffic shifting during ECS blue-green deployments by using
a load balancer listener to balance incoming traffic between the 'blue' and 'green' task sets/target groups
running two different versions of your ECS task definition.
Before deployment, the load balancer listener sends 100% of requests to the 'blue' target group.
When you publish a new version of the task definition and start a CodeDeploy deployment,
CodeDeploy can send a small percentage of traffic to the new 'green' task set behind the 'green' target group,
monitor, and validate before shifting 100% of traffic to the new version.

To create a new CodeDeploy Deployment Group that deploys to an ECS service:

```ts
declare const myApplication: codedeploy.EcsApplication;
declare const cluster: ecs.Cluster;
declare const taskDefinition: ecs.FargateTaskDefinition;
declare const blueTargetGroup: elbv2.ITargetGroup;
declare const greenTargetGroup: elbv2.ITargetGroup;
declare const listener: elbv2.IApplicationListener;

const service = new ecs.FargateService(this, 'Service', {
  cluster,
  taskDefinition,
  deploymentController: {
    type: ecs.DeploymentControllerType.CODE_DEPLOY,
  },
});

new codedeploy.EcsDeploymentGroup(this, 'BlueGreenDG', {
  service,
  blueGreenDeploymentConfig: {
    blueTargetGroup,
    greenTargetGroup,
    listener,
  },
  deploymentConfig: codedeploy.EcsDeploymentConfig.CANARY_10PERCENT_5MINUTES,
});
```

In order to deploy a new task definition version to the ECS service,
deploy the changes directly through CodeDeploy using the CodeDeploy APIs or console.
When the `CODE_DEPLOY` deployment controller is used, the ECS service cannot be
deployed with a new task definition version through CloudFormation.

For more information on the behavior of CodeDeploy blue-green deployments for ECS, see
[What happens during an Amazon ECS deployment](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-steps-ecs.html#deployment-steps-what-happens)
in the CodeDeploy user guide.

Note: If you wish to deploy updates to your ECS service through CDK and CloudFormation instead of directly through CodeDeploy,
using the [`CfnCodeDeployBlueGreenHook`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.CfnCodeDeployBlueGreenHook.html)
construct is the recommended approach instead of using the `EcsDeploymentGroup` construct.  For a comparison
of ECS blue-green deployments through CodeDeploy (using `EcsDeploymentGroup`) and through CloudFormation (using `CfnCodeDeployBlueGreenHook`),
see [Create an Amazon ECS blue/green deployment through AWS CloudFormation](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-create-ecs-cfn.html#differences-ecs-bg-cfn)
in the CloudFormation user guide.

### ECS Deployment Rollbacks and Alarms

CodeDeploy will automatically roll back if a deployment fails.
You can optionally trigger an automatic rollback when one or more alarms are in a failed state during a deployment, or if the deployment stops.

In this example, CodeDeploy will monitor and roll back on alarms set for the
number of unhealthy ECS tasks in each of the blue and green target groups,
as well as alarms set for the number HTTP 5xx responses seen in each of the blue
and green target groups.

```ts
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

declare const service: ecs.FargateService;
declare const blueTargetGroup: elbv2.ApplicationTargetGroup;
declare const greenTargetGroup: elbv2.ApplicationTargetGroup;
declare const listener: elbv2.IApplicationListener;

// Alarm on the number of unhealthy ECS tasks in each target group
const blueUnhealthyHosts = new cloudwatch.Alarm(this, 'BlueUnhealthyHosts', {
  alarmName: Stack.of(this).stackName + '-Unhealthy-Hosts-Blue',
  metric: blueTargetGroup.metricUnhealthyHostCount(),
  threshold: 1,
  evaluationPeriods: 2,
});

const greenUnhealthyHosts = new cloudwatch.Alarm(this, 'GreenUnhealthyHosts', {
  alarmName: Stack.of(this).stackName + '-Unhealthy-Hosts-Green',
  metric: greenTargetGroup.metricUnhealthyHostCount(),
  threshold: 1,
  evaluationPeriods: 2,
});

// Alarm on the number of HTTP 5xx responses returned by each target group
const blueApiFailure = new cloudwatch.Alarm(this, 'Blue5xx', {
  alarmName: Stack.of(this).stackName + '-Http-5xx-Blue',
  metric: blueTargetGroup.metricHttpCodeTarget(
    elbv2.HttpCodeTarget.TARGET_5XX_COUNT,
    { period: Duration.minutes(1) },
  ),
  threshold: 1,
  evaluationPeriods: 1,
});

const greenApiFailure = new cloudwatch.Alarm(this, 'Green5xx', {
  alarmName: Stack.of(this).stackName + '-Http-5xx-Green',
  metric: greenTargetGroup.metricHttpCodeTarget(
    elbv2.HttpCodeTarget.TARGET_5XX_COUNT,
    { period: Duration.minutes(1) },
  ),
  threshold: 1,
  evaluationPeriods: 1,
});

new codedeploy.EcsDeploymentGroup(this, 'BlueGreenDG', {
  // CodeDeploy will monitor these alarms during a deployment and automatically roll back
  alarms: [blueUnhealthyHosts, greenUnhealthyHosts, blueApiFailure, greenApiFailure],
  autoRollback: {
    // CodeDeploy will automatically roll back if a deployment is stopped
    stoppedDeployment: true,
  },
  service,
  blueGreenDeploymentConfig: {
    blueTargetGroup,
    greenTargetGroup,
    listener,
  },
  deploymentConfig: codedeploy.EcsDeploymentConfig.CANARY_10PERCENT_5MINUTES,
});
```

### Deployment validation and manual deployment approval

CodeDeploy blue-green deployments provide an opportunity to validate the new task definition version running on
the 'green' ECS task set prior to shifting any production traffic to the new version.  A second 'test' listener
serving traffic on a different port be added to the load balancer. For example, the test listener can serve
test traffic on port 9001 while the main listener serves production traffic on port 443.
During a blue-green deployment, CodeDeploy can then shift 100% of test traffic over to the 'green'
task set/target group prior to shifting any production traffic during the deployment.

```ts
declare const myApplication: codedeploy.EcsApplication;
declare const service: ecs.FargateService;
declare const blueTargetGroup: elbv2.ITargetGroup;
declare const greenTargetGroup: elbv2.ITargetGroup;
declare const listener: elbv2.IApplicationListener;
declare const testListener: elbv2.IApplicationListener;

new codedeploy.EcsDeploymentGroup(this, 'BlueGreenDG', {
  service,
  blueGreenDeploymentConfig: {
    blueTargetGroup,
    greenTargetGroup,
    listener,
    testListener,
  },
  deploymentConfig: codedeploy.EcsDeploymentConfig.CANARY_10PERCENT_5MINUTES,
});
```

Automated validation steps can run during the CodeDeploy deployment after shifting test traffic and before
shifting production traffic.  CodeDeploy supports registering Lambda functions as lifecycle hooks for
an ECS deployment.  These Lambda functions can run automated validation steps against the test traffic
port, for example in response to the `AfterAllowTestTraffic` lifecycle hook.  For more information about
how to specify the Lambda functions to run for each CodeDeploy lifecycle hook in an ECS deployment, see the
[AppSpec 'hooks' for an Amazon ECS deployment](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html#appspec-hooks-ecs)
section in the CodeDeploy user guide.

After provisioning the 'green' ECS task set and re-routing test traffic during a blue-green deployment,
CodeDeploy can wait for approval before continuing the deployment and re-routing production traffic.
During this approval wait time, you can complete additional validation steps prior to exposing the new
'green' task set to production traffic, such as manual testing through the test listener port or
running automated integration test suites.

To approve the deployment, validation steps use the CodeDeploy
[ContinueDeployment API(https://docs.aws.amazon.com/codedeploy/latest/APIReference/API_ContinueDeployment.html).
If the ContinueDeployment API is not called within the approval wait time period, CodeDeploy will stop the
deployment and can automatically roll back the deployment.

```ts
declare const service: ecs.FargateService;
declare const blueTargetGroup: elbv2.ITargetGroup;
declare const greenTargetGroup: elbv2.ITargetGroup;
declare const listener: elbv2.IApplicationListener;
declare const testListener: elbv2.IApplicationListener;

new codedeploy.EcsDeploymentGroup(this, 'BlueGreenDG', {
  autoRollback: {
    // CodeDeploy will automatically roll back if the 8-hour approval period times out and the deployment stops
    stoppedDeployment: true,
  },
  service,
  blueGreenDeploymentConfig: {
    // The deployment will wait for approval for up to 8 hours before stopping the deployment
    deploymentApprovalWaitTime: Duration.hours(8),
    blueTargetGroup,
    greenTargetGroup,
    listener,
    testListener,
  },
  deploymentConfig: codedeploy.EcsDeploymentConfig.CANARY_10PERCENT_5MINUTES,
});
```

### Deployment bake time

You can specify how long CodeDeploy waits before it terminates the original 'blue' ECS task set when a blue-green deployment
is complete in order to let the deployment "bake" a while. During this bake time, CodeDeploy will continue to monitor any
CloudWatch alarms specified for the deployment group and will automatically roll back if those alarms go into a failed state.

```ts
import { aws_cloudwatch as cloudwatch } from 'aws-cdk-lib';

declare const service: ecs.FargateService;
declare const blueTargetGroup: elbv2.ITargetGroup;
declare const greenTargetGroup: elbv2.ITargetGroup;
declare const listener: elbv2.IApplicationListener;
declare const blueUnhealthyHosts: cloudwatch.Alarm;
declare const greenUnhealthyHosts: cloudwatch.Alarm;
declare const blueApiFailure: cloudwatch.Alarm;
declare const greenApiFailure: cloudwatch.Alarm;

new codedeploy.EcsDeploymentGroup(this, 'BlueGreenDG', {
  service,
  blueGreenDeploymentConfig: {
    blueTargetGroup,
    greenTargetGroup,
    listener,
    // CodeDeploy will wait for 30 minutes after completing the blue-green deployment before it terminates the blue tasks
    terminationWaitTime: Duration.minutes(30),
  },
  // CodeDeploy will continue to monitor these alarms during the 30-minute bake time and will automatically
  // roll back if they go into a failed state at any point during the deployment.
  alarms: [blueUnhealthyHosts, greenUnhealthyHosts, blueApiFailure, greenApiFailure],
  deploymentConfig: codedeploy.EcsDeploymentConfig.CANARY_10PERCENT_5MINUTES,
});
```

### Import an existing ECS Deployment Group

To import an already existing Deployment Group:

```ts
declare const application: codedeploy.EcsApplication;
const deploymentGroup = codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(this, 'ExistingCodeDeployDeploymentGroup', {
  application,
  deploymentGroupName: 'MyExistingDeploymentGroup',
});
```

## ECS Deployment Configurations

CodeDeploy for ECS comes with predefined configurations for traffic shifting.
The predefined configurations are available as LambdaDeploymentConfig constants.

```ts
const config = codedeploy.EcsDeploymentConfig.CANARY_10PERCENT_5MINUTES;
```

If you want to specify your own strategy,
you can do so with the EcsDeploymentConfig construct,
letting you specify precisely how fast an ECS service is deployed.

```ts
new codedeploy.EcsDeploymentConfig(this, 'CustomConfig', {
  trafficRouting: new codedeploy.TimeBasedCanaryTrafficRouting({
    interval: Duration.minutes(15),
    percentage: 5,
  }),
});
```

You can specify a custom name for your deployment config, but if you do you will not be able to update the interval/percentage through CDK.

```ts
const config = new codedeploy.EcsDeploymentConfig(this, 'CustomConfig', {
  trafficRouting: new codedeploy.TimeBasedCanaryTrafficRouting({
    interval: Duration.minutes(15),
    percentage: 5,
  }),
  deploymentConfigName: 'MyDeploymentConfig',
});
```

Or import an existing one:

```ts
const deploymentConfig = codedeploy.EcsDeploymentConfig.fromEcsDeploymentConfigName(
  this,
  'ExistingDeploymentConfiguration',
  'MyExistingDeploymentConfiguration',
);
```

## ECS Deployments

[![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg)](https://constructs.dev/packages/@cdklabs/cdk-ecs-codedeploy)

An experimental construct is available on the Construct Hub called [@cdklabs/cdk-ecs-codedeploy](https://constructs.dev/packages/@cdklabs/cdk-ecs-codedeploy) that manages ECS CodeDeploy deployments.

```ts fixture=constructhub
declare const deploymentGroup: codedeploy.IEcsDeploymentGroup;
declare const taskDefinition: ecs.ITaskDefinition;

new EcsDeployment({
  deploymentGroup,
  targetService: {
    taskDefinition,
    containerName: 'mycontainer',
    containerPort: 80,
  },
});
```

The deployment will use the AutoRollbackConfig for the EcsDeploymentGroup unless it is overridden in the deployment:

```ts fixture=constructhub
declare const deploymentGroup: codedeploy.IEcsDeploymentGroup;
declare const taskDefinition: ecs.ITaskDefinition;

new EcsDeployment({
  deploymentGroup,
  targetService: {
    taskDefinition,
    containerName: 'mycontainer',
    containerPort: 80,
  },
  autoRollback: {
    failedDeployment: true,
    deploymentInAlarm: true,
    stoppedDeployment: false,
  },
});
```

By default, the CodeDeploy Deployment will timeout after 30 minutes. The timeout value can be overridden:

```ts fixture=constructhub
declare const deploymentGroup: codedeploy.IEcsDeploymentGroup;
declare const taskDefinition: ecs.ITaskDefinition;

new EcsDeployment({
  deploymentGroup,
  targetService: {
    taskDefinition,
    containerName: 'mycontainer',
    containerPort: 80,
  },
  timeout: Duration.minutes(60),
});
```
