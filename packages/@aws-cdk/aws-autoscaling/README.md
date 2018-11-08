## The CDK Construct Library for AWS Auto-Scaling
This module is part of the [AWS Cloud Development Kit](https://github.com/awslabs/aws-cdk) project.

### Fleet

### Auto Scaling Group

An `AutoScalingGroup` represents a number of instances on which you run your code. You
pick the size of the fleet, the instance type and the OS image:

```ts
import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');

new autoscaling.AutoScalingGroup(stack, 'ASG', {
    vpc,
    instanceType: new ec2.InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Micro),
    machineImage: new ec2.AmazonLinuxImage() // get the latest Amazon Linux image
});
```

> NOTE: AutoScalingGroup has an property called `allowAllOutbound` (allowing the instances to contact the
> internet) which is set to `true` by default. Be sure to set this to `false`  if you don't want
> your instances to be able to start arbitrary connections.

### Machine Images (AMIs)

AMIs control the OS that gets launched when you start your EC2 instance. The EC2
library contains constructs to select the AMI you want to use.

Depending on the type of AMI, you select it a different way.

The latest version of Amazon Linux and Microsoft Windows images are
selectable by instantiating one of these classes:

[example of creating images](test/example.images.lit.ts)

> NOTE: The Amazon Linux images selected will be cached in your `cdk.json`, so that your
> AutoScalingGroups don't automatically change out from under you when you're making unrelated
> changes. To update to the latest version of Amazon Linux, remove the cache entry from the `context`
> section of your `cdk.json`.
>
> We will add command-line options to make this step easier in the future.

### Allowing Connections

See the documentation of the aws-ec2 package for more information about allowing
connections between resources backed by instances.
