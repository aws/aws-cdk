## The CDK Construct Library for AWS CodeDeploy

### Applications

To create a new CodeDeploy Application that deploys to EC2/on-premise instances:

```ts
import codedeploy = require('@aws-cdk/aws-codedeploy');

const application = new codedeploy.ServerApplication(this, 'CodeDeployApplication', {
    applicationName: 'MyApplication', // optional property
});
```

To import an already existing Application:

```ts
const application = codedeploy.ServerApplicationRef.import(this, 'ExistingCodeDeployApplication', {
    applicationName: 'MyExistingApplication',
});
```

### Deployment Groups

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
});
```

All properties are optional - if you don't provide an Application,
one will be automatically created.

To import an already existing Deployment Group:

```ts
const deploymentGroup = codedeploy.ServerDeploymentGroupRef.import(this, 'ExistingCodeDeployDeploymentGroup', {
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
const deploymentConfig = codedeploy.ServerDeploymentConfigRef.import(this, 'ExistingDeploymentConfiguration', {
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
    applicationName: 'YourCodeDeployApplicationName',
    deploymentGroupName: 'YourCodeDeployDeploymentGroupName',
});
```
