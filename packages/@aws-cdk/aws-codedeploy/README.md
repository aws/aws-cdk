## AWS CodeDeploy Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

AWS CodeDeploy is a deployment service that automates application deployments to
Amazon EC2 instances, on-premises instances, serverless Lambda functions, or
Amazon ECS services.

The CDK currently supports Amazon EC2, on-premise and AWS Lambda applications.

### EC2/on-premise Applications

To create a new CodeDeploy Application that deploys to EC2/on-premise instances:

```ts
import * as codedeploy from '@aws-cdk/aws-codedeploy';

const application = new codedeploy.ServerApplication(this, 'CodeDeployApplication', {
    applicationName: 'MyApplication', // optional property
});
```

To import an already existing Application:

```ts
const application = codedeploy.ServerApplication.fromServerApplicationName(
  this, 'ExistingCodeDeployApplication', 'MyExistingApplication'
);
```

### EC2/on-premise Deployment Groups

To create a new CodeDeploy Deployment Group that deploys to EC2/on-premise instances:

```ts
const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'CodeDeployDeploymentGroup', {
    application,
    deploymentGroupName: 'MyDeploymentGroup',
    autoScalingGroups: [asg1, asg2],
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
    alarms: [
        new cloudwatch.Alarm(/* ... */),
    ],
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
const deploymentGroup = codedeploy.ServerDeploymentGroup.fromLambdaDeploymentGroupAttributes(this, 'ExistingCodeDeployDeploymentGroup', {
    application,
    deploymentGroupName: 'MyExistingDeploymentGroup',
});
```

#### Load balancers

You can [specify a load balancer](https://docs.aws.amazon.com/codedeploy/latest/userguide/integrations-aws-elastic-load-balancing.html)
with the `loadBalancer` property when creating a Deployment Group.

`LoadBalancer` is an abstract class with static factory methods that allow you to create instances of it from various sources.

With Classic Elastic Load Balancer, you provide it directly:

```ts
import * as lb from '@aws-cdk/aws-elasticloadbalancing';

const elb = new lb.LoadBalancer(this, 'ELB', {
  // ...
});
elb.addTarget(/* ... */);
elb.addListener({
  // ...
});

const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'DeploymentGroup', {
  loadBalancer: codedeploy.LoadBalancer.classic(elb),
});
```

With Application Load Balancer or Network Load Balancer,
you provide a Target Group as the load balancer:

```ts
import * as lbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

const alb = new lbv2.ApplicationLoadBalancer(this, 'ALB', {
  // ...
});
const listener = alb.addListener('Listener', {
  // ...
});
const targetGroup = listener.addTargets('Fleet', {
  // ...
});

const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'DeploymentGroup', {
  loadBalancer: codedeploy.LoadBalancer.application(targetGroup),
});
```

### Deployment Configurations

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
    minHealthyHostCount: 2,
    minHealthyHostPercentage: 75,
});
```

Or import an existing one:

```ts
const deploymentConfig = codedeploy.ServerDeploymentConfig.fromServerDeploymentConfigName(
  this, 'ExistingDeploymentConfiguration', 'MyExistingDeploymentConfiguration'
);
```

### Lambda Applications

To create a new CodeDeploy Application that deploys to a Lambda function:

```ts
import * as codedeploy from '@aws-cdk/aws-codedeploy';

const application = new codedeploy.LambdaApplication(this, 'CodeDeployApplication', {
    applicationName: 'MyApplication', // optional property
});
```

To import an already existing Application:

```ts
const application = codedeploy.LambdaApplication.fromLambdaApplicationName(
  this, 'ExistingCodeDeployApplication', 'MyExistingApplication'
);
```

### Lambda Deployment Groups

To enable traffic shifting deployments for Lambda functions, CodeDeploy uses Lambda Aliases, which can balance incoming traffic between two different versions of your function.
Before deployment, the alias sends 100% of invokes to the version used in production.
When you publish a new version of the function to your stack, CodeDeploy will send a small percentage of traffic to the new version, monitor, and validate before shifting 100% of traffic to the new version.

To create a new CodeDeploy Deployment Group that deploys to a Lambda function:

```ts
import * as codedeploy from '@aws-cdk/aws-codedeploy';
import * as lambda from '@aws-cdk/aws-lambda';

const myApplication = new codedeploy.LambdaApplication(..);
const func = new lambda.Function(..);
const version = func.addVersion('1');
const version1Alias = new lambda.Alias(this, 'alias', {
  aliasName: 'prod',
  version
});

const deploymentGroup = new codedeploy.LambdaDeploymentGroup(stack, 'BlueGreenDeployment', {
  application: myApplication, // optional property: one will be created for you if not provided
  alias: version1Alias,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
});
```

In order to deploy a new version of this function:
1. Increment the version, e.g. `const version = func.addVersion('2')`.
2. Re-deploy the stack (this will trigger a deployment).
3. Monitor the CodeDeploy deployment as traffic shifts between the versions.

#### Rollbacks and Alarms

CodeDeploy will roll back if the deployment fails. You can optionally trigger a rollback when one or more alarms are in a failed state:

```ts
const deploymentGroup = new codedeploy.LambdaDeploymentGroup(stack, 'BlueGreenDeployment', {
  alias,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
  alarms: [
    // pass some alarms when constructing the deployment group
    new cloudwatch.Alarm(stack, 'Errors', {
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: 1,
      evaluationPeriods: 1,
      metric: alias.metricErrors()
    })
  ]
});

// or add alarms to an existing group
deploymentGroup.addAlarm(new cloudwatch.Alarm(stack, 'BlueGreenErrors', {
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
  threshold: 1,
  evaluationPeriods: 1,
  metric: blueGreenAlias.metricErrors()
}));
```

#### Pre and Post Hooks

CodeDeploy allows you to run an arbitrary Lambda function before traffic shifting actually starts (PreTraffic Hook) and after it completes (PostTraffic Hook).
With either hook, you have the opportunity to run logic that determines whether the deployment must succeed or fail.
For example, with PreTraffic hook you could run integration tests against the newly created Lambda version (but not serving traffic). With PostTraffic hook, you could run end-to-end validation checks.

```ts
const warmUpUserCache = new lambda.Function(..);
const endToEndValidation = new lambda.Function(..);

// pass a hook whe creating the deployment group
const deploymentGroup = new codedeploy.LambdaDeploymentGroup(stack, 'BlueGreenDeployment', {
  alias: alias,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
  preHook: warmUpUserCache,
});

// or configure one on an existing deployment group
deploymentGroup.onPostHook(endToEndValidation);
```

#### Import an existing Deployment Group

To import an already existing Deployment Group:

```ts
const deploymentGroup = codedeploy.LambdaDeploymentGroup.import(this, 'ExistingCodeDeployDeploymentGroup', {
    application,
    deploymentGroupName: 'MyExistingDeploymentGroup',
});
```
