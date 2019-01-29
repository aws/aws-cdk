## The CDK Construct Library for AWS CodeDeploy

### EC2/On-Premise Applications

To create a new CodeDeploy Application that deploys to EC2/on-premise instances:

```ts
import codedeploy = require('@aws-cdk/aws-codedeploy');

const application = new codedeploy.ServerApplication(this, 'CodeDeployApplication', {
    applicationName: 'MyApplication', // optional property
});
```

To import an already existing Application:

```ts
const application = codedeploy.ServerApplication.import(this, 'ExistingCodeDeployApplication', {
    applicationName: 'MyExistingApplication',
});
```

### EC2/On-Premise Deployment Groups

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
const deploymentGroup = codedeploy.ServerDeploymentGroup.import(this, 'ExistingCodeDeployDeploymentGroup', {
    application,
    deploymentGroupName: 'MyExistingDeploymentGroup',
});
```

#### Load balancers

You can [specify a load balancer](https://docs.aws.amazon.com/codedeploy/latest/userguide/integrations-aws-elastic-load-balancing.html)
with the `loadBalancer` property when creating a Deployment Group.

With Classic Elastic Load Balancer, you provide it directly:

```ts
import lb = require('@aws-cdk/aws-elasticloadbalancing');

const elb = new lb.LoadBalancer(this, 'ELB', {
    // ...
});
elb.addTarget(/* ... */);
elb.addListener({
    // ...
});

const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'DeploymentGroup', {
    loadBalancer: elb,
});
```

With Application Load Balancer or Network Load Balancer,
you provide a Target Group as the load balancer:

```ts
import lbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');

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
    loadBalancer: targetGroup,
});
```

### Deployment Configurations

You can also pass a Deployment Configuration when creating the Deployment Group:

```ts
const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'CodeDeployDeploymentGroup', {
    deploymentConfig: codedeploy.ServerDeploymentConfig.AllAtOnce,
});
```

The default Deployment Configuration is `ServerDeploymentConfig.OneAtATime`.

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
const deploymentConfig = codedeploy.ServerDeploymentConfig.import(this, 'ExistingDeploymentConfiguration', {
    deploymentConfigName: 'MyExistingDeploymentConfiguration',
});
```

### Use in CodePipeline

This module also contains an Action that allows you to use CodeDeploy with AWS CodePipeline.

Example:

```ts
import codepipeline = require('@aws-cdk/aws-codepipeline');

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline', {
    pipelineName: 'MyPipeline',
});

// add the source and build Stages to the Pipeline...

const deployStage = pipeline.addStage('Deploy');
new codedeploy.PipelineDeployAction(this, 'CodeDeploy', {
    stage: deployStage,
    deploymentGroup,
});
```

You can also add the Deployment Group to the Pipeline directly:

```ts
// equivalent to the code above:
deploymentGroup.addToPipeline(deployStage, 'CodeDeploy');
```

### Lambda Applications

To create a new CodeDeploy application that deploys to a Lambda function:

```ts
import codedeploy = require('@aws-cdk/aws-codedeploy');

const application = new codedeploy.LambdaApplication(this, 'CodeDeployApplication', {
    applicationName: 'MyApplication', // optional property
});
```

To import an already existing Application:

```ts
const application = codedeploy.LambdaApplication.import(this, 'ExistingCodeDeployApplication', {
    applicationName: 'MyExistingApplication',
});
```

### Lambda Deployment Groups

To create a new CodeDeploy Deployment Group that deploys to a Lambda function:

```ts
import codedeploy = require('@aws-cdk/aws-codedeploy');
import lambda = require('@aws-cdk/aws-lambda');

const group = new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
    application,
    // Alias of function to manage deployment to
    alias: new lambda.Alias(..),
    // Deployment config (all at once, linear x percent, canary x percent, etc.)
    deploymentConfig: LambdaDeploymentConfig.AllAtOnce,

    // Functions to run before/after deployment
    preHook: new lambda.Function(..),
    postHook: new lambda.Function(..),

     // CloudWatch alarms to trigger rollback on failure
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

Creating the deployment group will modify the `lambda.Alias`'s UpdatePolicy to trigger a deployment on update. For example, incrementing the `lambda.Version` and deploying the stack will update the alias according to your deployment config (blue/green, pre/post hooks, alarms, etc.).

To import an already existing Deployment Group:

```ts
const deploymentGroup = codedeploy.LambdaDeploymentGroup.import(this, 'ExistingCodeDeployDeploymentGroup', {
    application,
    deploymentGroupName: 'MyExistingDeploymentGroup',
});
```
